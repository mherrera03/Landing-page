# Despliegue en Vercel: landing y admin en dominios separados

| Dominio | Qué sirve |
|---|---|
| `dominio.com` | Landing pública. `/admin` responde 404. |
| `admin.dominio.com` | Panel administrativo (con login). No sirve páginas públicas. |

## Arquitectura

Es **un solo proyecto de Vercel** con los dos dominios apuntando a él. Landing y admin comparten
código, base de datos y Server Actions; lo que cambia es qué deja pasar cada dominio.

La separación la hace [`src/proxy.ts`](../src/proxy.ts) leyendo el encabezado `Host`, con las reglas
de [`src/lib/hosts.ts`](../src/lib/hosts.ts):

| Petición | En `dominio.com` | En `admin.dominio.com` |
|---|---|---|
| `/`, `/noticias`, `/cursos/...` | Se sirve | `/` → `/admin`; el resto redirige a `dominio.com` |
| `/admin/...` | **404** (no redirige: no delata que existe un panel) | Se sirve, con login |
| `/api/leads` | Se sirve | Redirige a `dominio.com` |
| Archivos estáticos (`/_next`, `/images`) | Se sirven | Se sirven (el panel muestra las imágenes subidas) |

Dentro del subdominio las rutas conservan el prefijo: `admin.dominio.com/admin/cursos`. Así las
mismas URLs funcionan en desarrollo y en Preview, donde no hay subdominio.

Segunda barrera: `requireSession()` y el login vuelven a comprobar el host
(`assertAdminHost()` en [`dal.ts`](../src/server/auth/dal.ts)), porque las Server Actions viajan
como POST a cualquier ruta y el proxy solo filtra por URL.

### Sesión y cookies

- La cookie de sesión **no lleva `Domain`**: queda atada a `admin.dominio.com` y el navegador nunca
  la envía a `dominio.com`.
- En producción se llama `__Host-ugbplus_session`. El prefijo `__Host-` obliga al navegador a exigir
  `Secure`, `Path=/` y sin `Domain`, así que ningún otro subdominio puede sobrescribirla.
- `HttpOnly`, `SameSite=Lax`, 8 horas. Firmada con `SESSION_SECRET` (JWT HS256).
- Rutas `/admin/*` con `X-Robots-Tag: noindex`, `X-Frame-Options: DENY` y
  `Referrer-Policy: same-origin` (ver [`next.config.ts`](../next.config.ts)).

## Variables de entorno (Settings → Environment Variables)

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | Obligatoria, marcada *Sensitive* | Obligatoria, **valor distinto** al de producción | Opcional |
| `ADMIN_HOST` | `admin.dominio.com` | No definir | No definir (o `admin.localhost:3000` para probar) |
| `PUBLIC_HOST` | `dominio.com` | No definir | No definir (o `localhost:3000`) |

- `SESSION_SECRET`: mínimo 32 caracteres; sin él la app no arranca en producción ni en Preview.
  Generar con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- Sin `ADMIN_HOST` la separación queda **apagada**: todo responde en el mismo host, con el panel en
  `/admin`. Es lo correcto en Preview (cada despliegue tiene una URL distinta) y en desarrollo.
- Cambiar una variable no afecta a los despliegues existentes: hay que volver a desplegar.

### Los tres entornos

- **Production**: separación activa. Ojo: la URL `proyecto.vercel.app` pasa a comportarse como
  dominio público (su `/admin` da 404); al panel solo se entra por `admin.dominio.com`.
- **Preview**: panel en `https://<url-del-preview>/admin`. Mantener activado *Deployment Protection →
  Vercel Authentication* (Settings → Deployment Protection) para que los Preview no sean públicos.
- **Development**: `http://localhost:3000` y `http://localhost:3000/admin`. Para probar la
  separación, definir en `.env` `ADMIN_HOST=admin.localhost:3000` y `PUBLIC_HOST=localhost:3000`, y
  abrir `http://admin.localhost:3000` (los navegadores resuelven `*.localhost` solos).

## Cuando tengamos el dominio definitivo

### 1. Vercel → Project → Settings → Domains

Agregar los tres al **mismo proyecto**, todos asignados a Production:

1. `dominio.com`
2. `www.dominio.com` → configurarlo como redirección a `dominio.com`
3. `admin.dominio.com`

### 2. DNS (en el proveedor donde se compró el dominio)

Vercel muestra los valores exactos al agregar cada dominio; usar esos. Normalmente son:

| Tipo | Nombre | Valor |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |
| `CNAME` | `admin` | `cname.vercel-dns.com` |

Alternativa: delegar el dominio a los nameservers de Vercel y que él cree los registros. El
certificado HTTPS de cada dominio se emite solo cuando el DNS ya resuelve.

Si el dominio es institucional (p. ej. un subdominio de `ugb.edu.sv`), TI solo necesita crear dos
`CNAME` hacia `cname.vercel-dns.com`: uno para el sitio y otro para `admin.`.

### 3. Activar la separación

1. Definir `ADMIN_HOST` y `PUBLIC_HOST` en **Production** y volver a desplegar.
2. En el panel → Configuración → *URL pública del sitio*: poner `https://dominio.com`.
3. Comprobar: `https://dominio.com/admin` da 404; `https://admin.dominio.com` lleva al login;
   tras iniciar sesión, "Ver la landing" abre `https://dominio.com`.

No hace falta `vercel.json` ni rewrites adicionales.

## Base de datos, imágenes y primera cuenta

El proyecto decide a dónde escribir según las variables de entorno. Sin ninguna puesta funciona
contra tu disco, que es lo que quieres en tu equipo; en Vercel hacen falta las tres, porque allí
el disco es de solo lectura y además se borra en cada despliegue.

### Base de datos (Turso)

Se usa [Turso](https://turso.tech), que es el mismo SQLite pero alojado: el SQL y las migraciones
son idénticos a los de tu equipo.

1. Crea una base en Turso y copia su URL (`libsql://…`) y un token de autenticación.
2. En Vercel, **Settings → Environment Variables**:
   - `DATABASE_URL`
   - `DATABASE_AUTH_TOKEN`

Las migraciones se aplican solas la primera vez que arranca, y quedan anotadas en la tabla
`migraciones` para no repetirse.

Si no defines nada, se usa `database/data/ugbplus.db`, que es lo normal en desarrollo y lo que
seguiría usándose en un VPS.

### Imágenes (Vercel Blob)

En el proyecto de Vercel, pestaña **Storage → Blob → Create**. Al conectarlo, Vercel añade sola la
variable `BLOB_READ_WRITE_TOKEN`.

Con esa variable, [`saveImage`](../src/server/storage/uploads.ts) sube a Blob y guarda la URL
completa; sin ella escribe en `public/images`, como hasta ahora. El resto de la aplicación no
cambia porque todo pasa por ese archivo.

### Fechas y zona horaria

Las fechas se guardan como `AAAA-MM-DD HH:MM:SS` en **hora de El Salvador**, y las calcula la
aplicación con [`nowForDatabase()`](../src/lib/dates.ts), no la base de datos.

El motivo: el `datetime('now','localtime')` de SQLite devuelve la hora del servidor. En tu equipo
eso es El Salvador, pero en Turso es UTC, así que una solicitud recibida a las 7 de la noche se
habría guardado como la 1 de la madrugada del día siguiente.

> Si escribes una consulta nueva que inserte filas, **pasa la fecha como parámetro**. Las columnas
> aún tienen un `DEFAULT (datetime('now','localtime'))` heredado del esquema original, y dejar que
> se aplique volvería a guardar la hora del servidor.

### Primera cuenta del panel

Define `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Se usan **una sola vez**, al crear la base vacía, para
dar de alta la primera cuenta de administrador; después se administran desde `/admin/usuarios` y
puedes borrarlas de Vercel.

En producción, si faltan, **no se crea ninguna cuenta** (queda un aviso en el registro) y habría
que insertarla a mano. En desarrollo, si faltan, se usa una cuenta de prueba para que el equipo
pueda entrar recién clonado el proyecto.

> ⚠️ La cuenta de prueba (`admin@ugb.edu.sv`) ya no existe en producción, pero **sigue activa en
> las bases de datos de desarrollo** creadas antes de este cambio. No subas esa base a ningún
> sitio público.
