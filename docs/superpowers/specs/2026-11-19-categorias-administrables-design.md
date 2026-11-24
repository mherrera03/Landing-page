# Categorías de cursos administrables — diseño

Fecha: 2026-11-19 · Tamaño: proyecto

## Intención

Hoy las categorías de cursos son tres y están clavadas en el código. Bryan
quiere **más categorías** (Humanidades, Diseño y Arquitectura) y, sobre todo,
que **el personal de la unidad pueda crear las suyas** desde el panel, sin
pedirle un cambio de código a nadie.

Las tres categorías nuevas salen gratis una vez exista el módulo: entran como
datos, no como código.

## Objetivos

- Crear, renombrar, reordenar y borrar categorías desde el panel.
- Que las categorías actuales y los cursos que ya existen sigan funcionando sin
  que nadie toque nada.
- Que la landing refleje las categorías nuevas sin más trabajo.

## No objetivos

- Subcategorías o jerarquías.
- Categorías por evento, noticia o anuncio: esto es solo para cursos.
- Permisos finos: quien entra al panel y puede editar cursos puede editar
  categorías.

## Anti objetivos

Sería un fracaso, aunque funcionara, si:

- borrar una categoría dejara cursos apuntando a algo que ya no existe;
- renombrar una categoría rompiera los enlaces o los filtros de la landing;
- la barra de filtros de la landing creciera sin control hasta volverse
  inservible según se vayan agregando categorías.

## Restricciones

Las categorías viven hoy en tres sitios acoplados entre sí:

1. `src/types/course.types.ts` — `CourseCategory` es una unión literal de tres
   valores, así que el compilador conoce las categorías.
2. `src/constants/course-categories.ts` — claves y etiquetas.
3. La tabla `cursos`, con `CHECK (categoria IN ('tecnologia','negocios','habilidades'))`.

SQLite **no permite quitar un `CHECK`** con `ALTER TABLE`: hay que reconstruir
la tabla (crear la nueva, copiar, borrar la vieja, renombrar).

`PRAGMA foreign_keys = ON` solo se ejecuta cuando la base es un archivo local
(ver `connection.ts`); en Turso no se aplica. Por eso **no se puede confiar en
una clave foránea** para impedir borrados: el comportamiento sería distinto en
local y en producción.

## Enfoques considerados

Aquí hay una sola manera sensata de guardarlo —una tabla `categorias`, como
`aliados`— y el módulo de Aliados que subió David sirve de plantilla. Lo que sí
se decidió entre alternativas reales es **qué guarda la tabla `cursos`**:

| | Enfoque | Compromiso |
|---|---|---|
| **A** | **`cursos.categoria` sigue guardando la clave de texto** (`'tecnologia'`), y `categorias` la tiene como columna única | **Elegido.** Los cursos que ya existen no se tocan, los enlaces y filtros de la landing siguen valiendo, y renombrar una categoría no afecta a nada. |
| B | `cursos.categoria_id` apunta al `id` de la tabla nueva | Más ortodoxo, pero obliga a migrar todas las filas de `cursos` y a cambiar el filtro de la landing, que hoy usa la clave. Ganancia real: ninguna, porque la clave ya es única. |
| C | Guardar el nombre visible directamente (`'Tecnología'`) | Renombrar una categoría dejaría huérfanos todos sus cursos. Descartado. |

## El diseño

### Base de datos — migración `012_categorias`

Tabla nueva:

```sql
CREATE TABLE categorias (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  clave          TEXT NOT NULL UNIQUE,   -- 'tecnologia', estable, no se edita
  nombre         TEXT NOT NULL,          -- 'Tecnología', es lo que se ve
  orden          INTEGER NOT NULL DEFAULT 0,
  creado_en      TEXT NOT NULL,
  actualizado_en TEXT NOT NULL
);
```

Se siembran las tres actuales con su clave y etiqueta de hoy, más las tres que
pidió Bryan, para que estén desde el primer arranque.

Y se reconstruye `cursos` sin el `CHECK` de `categoria`, copiando los datos. El
resto de columnas y sus `CHECK` (nivel, modalidad, estado) se quedan igual.

### Tipos

- `CourseCategory` pasa de unión literal a `string`. Es la pérdida que trae
  esto: el compilador deja de saber qué categorías existen.
- `Course` gana **`categoryName: string`**: el nombre visible ya resuelto.

### Repositorio

`courses.repository` hace `LEFT JOIN categorias` en todas sus consultas y
rellena `categoryName`. Así ninguna vista necesita buscar la etiqueta por su
cuenta ni recibir la lista de categorías por props. Es el cambio que mantiene
pequeño el resto del trabajo.

`LEFT JOIN` y no `JOIN`: si alguna vez queda un curso con una categoría
borrada, se ve el curso con el nombre vacío en lugar de desaparecer del panel
sin explicación.

`categories.repository` nuevo, calcado de `partners.repository`: `findAll`,
`findById`, `nextOrder`, `create`, `update`, `remove`, más
**`countCourses(clave)`** para el borrado.

### Borrado

El servicio comprueba cuántos cursos usan la categoría. Si hay alguno, **no se
borra** y el panel dice cuántos son. Es una comprobación en el servidor, no en
la base, por lo de `foreign_keys` en Turso.

### Panel

Sección nueva **Categorías** en la barra lateral, junto a Cursos: listado,
crear y editar, igual que Aliados.

- Al crear, la **clave se genera del nombre** (reusando `slugField`).
- Al editar **solo se cambia el nombre y el orden**: la clave queda fija, que es
  justo lo que hace que renombrar sea inofensivo.
- El selector de categoría de `CourseForm` se alimenta de la tabla.

### Landing

La barra de filtros deja de pintar una pastilla por categoría existente y pinta
**solo las categorías que tienen al menos un curso visible**, deduciéndolas de
los propios cursos. Con categorías ilimitadas, lo de ahora llenaría la barra de
filtros vacíos. De paso, la parte pública no necesita consultar la tabla nueva.

## Mis decisiones

- **"Diseño" y "Arquitectura" en singular**, para que peguen con "Tecnología",
  aunque en la petición venían en plural. Se cambian desde el panel en un
  minuto si Bryan prefiere el plural.
- **La clave no se edita nunca.** Permitirlo obligaría a actualizar los cursos
  en cascada para no ganar nada: lo que se ve es el nombre.
- **Sin clave foránea**, por lo explicado de Turso: una sola regla, aplicada en
  el servidor, igual en local y en producción.
- **Sin columna `visible`** en categorías, al contrario que en aliados: una
  categoría sin cursos visibles ya no sale en la landing, así que ocultarla a
  mano sobraría.

## Qué queda al criterio de quien lo implemente

- El reparto exacto de la pantalla del listado y del formulario.
- Si el orden se edita con un número o con flechas.
- Los textos concretos de los mensajes de error.

## Alcance de archivos

Nuevos: `category.types.ts`, `category.schema.ts`, `categories.repository.ts`,
`categories.actions.ts`, las tres páginas de `admin/(panel)/categorias/` y los
componentes `CategoryTable`, `CategoryForm`, `DeleteCategoryButton`.

Modificados: la migración `index.ts`, `course.types.ts`, `course.schema.ts`,
`courses.repository.ts`, `CourseForm`, `CourseTable`, `AdminSidebar`,
`CourseCard`, `CourseDetail`, `CourseFilters`, `CourseGrid` y
`cursos/[slug]/page.tsx`.

Se elimina `src/constants/course-categories.ts`.

---

## Resueltas tras la revisión

Siete huecos que levantó la revisión del documento. Los siete los decido yo;
ninguno cambia lo que se ve, salvo el segundo.

**1. Qué impide guardar un curso con una categoría inexistente.** Al quitar el
`CHECK` y el `z.enum` quedaban dos cerrojos menos. El nuevo va en
`courses.actions.ts`: antes de crear o actualizar se comprueba que la clave
exista en `categorias` y, si no, se devuelve el error en el campo `category`.
No va en el esquema de Zod: haría falta un esquema asíncrono y habría que tocar
`parseForm` y, con él, todos los formularios del panel.

**2. `categorias.orden` sí manda en la landing.** El documento se contradecía:
daba un campo "orden" en el panel y a la vez deducía las pastillas de los
cursos, con lo que reordenar no habría hecho nada. Un campo que no hace nada es
peor que no tenerlo, así que `courses.repository` trae también `categoryOrder`
en el `LEFT JOIN` y la barra de filtros ordena por él. La parte pública sigue
sin consultar la tabla nueva.

**3. La clave es invisible y se de-duplica sola.** Se genera con `slugify` y
nunca se muestra ni se edita. Si ya existe, se le añade un sufijo (`diseno-2`).
El mínimo de longitud baja a 2 caracteres —el de `slugField` son 3— para que
"IA" o "TI" sean nombres válidos.

**4. `countCourses` cuenta todos los cursos, visibles u ocultos.** Contar solo
los visibles dejaría huérfano a un curso oculto, que es justo el anti objetivo.
Cuando el borrado queda bloqueado se dice cuántos cursos la usan y ahí termina:
**mover los cursos a otra categoría no entra en esta entrega**.

**5. No se puede borrar la última categoría.** Sin esta regla se podía llegar a
cero y entonces no habría forma de crear un curso desde el panel. Aun así,
`CourseForm` muestra un aviso con enlace a Categorías si la lista llegara vacía
por cualquier otro camino.

**6. Un curso huérfano no pinta pastilla.** Si `categoryName` viene vacío, la
landing omite la pastilla y el epígrafe en vez de dejar un hueco o una pastilla
en blanco. En el panel sí se ve el curso, como ya estaba dicho.

**7. El centinela del filtro "Todos" deja de ser `"all"`.** Con claves libres,
una categoría llamada "All" generaría la clave `all` y su pastilla se habría
comportado como "ver todos". Pasa a ser `null`, que no puede chocar con ninguna
clave.

### Añadido al alcance

`src/app/admin/(panel)/cursos/nuevo/page.tsx` y
`src/app/admin/(panel)/cursos/[id]/editar/page.tsx` también cambian: son las
que tienen que pasarle la lista de categorías a `CourseForm`.
