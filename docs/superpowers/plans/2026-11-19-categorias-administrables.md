# Categorías de cursos administrables — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el personal del panel pueda crear, renombrar, reordenar y borrar las categorías de cursos, en lugar de tenerlas clavadas en el código.

**Architecture:** Una tabla `categorias` con `clave` (estable, generada, nunca editable) y `nombre` (visible, editable). `cursos.categoria` sigue guardando la clave, así que ningún curso existente se migra. `courses.repository` resuelve el nombre y el orden con un `LEFT JOIN`, de modo que ninguna vista necesita consultar la tabla nueva ni recibir la lista por props. El panel gana una sección calcada de Aliados.

**Tech Stack:** Next.js 16 (App Router, Server Actions), React 19, libSQL/Turso, Zod v4, Tailwind v4, TypeScript.

**Spec:** `docs/superpowers/specs/2026-11-19-categorias-administrables-design.md`

## Global Constraints

- **El proyecto no tiene framework de pruebas** (sin vitest/jest, sin `npm test`, cero archivos `*.test.*`). Instalarlo no está en el alcance aprobado. Las puertas de cada tarea son, por tanto: `npm run typecheck`, `npm run lint` y una comprobación concreta en la app corriendo. Cada paso de verificación dice qué mirar y qué resultado cuenta como correcto.
- El servidor de desarrollo ya está levantado en `http://localhost:3000`. Las migraciones se aplican al arrancar; tras tocar `migrations/index.ts` hay que **reiniciar** el servidor, no basta con recargar.
- La clave de una categoría **nunca** se edita después de crearse.
- `PRAGMA foreign_keys` solo se activa con base de archivo local, no en Turso: **ninguna regla de integridad puede depender de una clave foránea**. Todo se comprueba en el servidor.
- América/El Salvador es UTC−6 todo el año. En SQL de migración, la hora local se escribe `datetime('now','-6 hours')`; en TypeScript se usa `nowForDatabase()` de `src/lib/dates.ts`.
- No se edita ninguna migración ya existente (001–011): en bases donde ya se aplicaron, no volverían a ejecutarse.
- Nombres de las seis categorías sembradas, exactos: `Tecnología`, `Negocios`, `Habilidades`, `Humanidades`, `Diseño`, `Arquitectura`.

## Review Focus

Cinco entradas que el diseño implica y que ninguna tarea exercita por sí sola. Cada una tiene abajo el paso que la fija, en la tarea que la posee.

1. **Dos nombres distintos que producen la misma clave** ("Diseño" y "Diseno"): el segundo debe guardarse como `diseno-2`, no reventar contra el `UNIQUE`. → Tarea 2.
2. **Nombre de dos letras** ("IA", "TI"): debe aceptarse. `slugField` exige 3 caracteres y lo rechazaría. → Tarea 2.
3. **Borrar una categoría cuyo único curso está oculto**: debe quedar bloqueada y decir "1 curso". → Tarea 5.
4. **Borrar la última categoría que queda**: debe quedar bloqueada aunque no tenga cursos. → Tarea 5.
5. **Curso cuya categoría ya no existe** (`categoryName` vacío): la landing no pinta pastilla ni epígrafe, y el panel sigue mostrando el curso. → Tarea 3.

---

### Task 1: Migración `012_categorias`

**Files:**
- Modify: `src/server/database/migrations/index.ts` (añadir al final del array `MIGRATIONS`, tras `011_aliado_recla`)

**Interfaces:**
- Consumes: nada.
- Produces: tabla `categorias (id, clave, nombre, orden, creado_en, actualizado_en)` con seis filas; tabla `cursos` sin el `CHECK` de `categoria`.

- [ ] **Step 1: Añadir la migración**

Entrada nueva en `MIGRATIONS` con `name: "012_categorias"`. El SQL hace tres cosas, en este orden:

```sql
CREATE TABLE categorias (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  clave          TEXT NOT NULL UNIQUE,
  nombre         TEXT NOT NULL,
  orden          INTEGER NOT NULL DEFAULT 0,
  creado_en      TEXT NOT NULL DEFAULT (datetime('now','-6 hours')),
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now','-6 hours'))
);

INSERT INTO categorias (clave, nombre, orden) VALUES
  ('tecnologia','Tecnología',1), ('negocios','Negocios',2), ('habilidades','Habilidades',3),
  ('humanidades','Humanidades',4), ('diseno','Diseño',5), ('arquitectura','Arquitectura',6);

CREATE TABLE cursos_nuevo ( /* … idéntica a cursos, pero `categoria TEXT NOT NULL` sin CHECK … */ );
INSERT INTO cursos_nuevo SELECT * FROM cursos;
DROP TABLE cursos;
ALTER TABLE cursos_nuevo RENAME TO cursos;
CREATE INDEX idx_cursos_visible ON cursos (visible, orden);
```

`cursos_nuevo` copia **literalmente** las columnas de `cursos` en migración 001 (mismo orden, mismos tipos, mismos `CHECK` de nivel/modalidad/estado, mismos `DEFAULT`), cambiando solo la línea de `categoria`. El `INSERT … SELECT *` depende de que el orden de columnas coincida.

Comentario en el código explicando por qué se reconstruye la tabla: SQLite no permite quitar un `CHECK` con `ALTER TABLE`.

- [ ] **Step 2: Reiniciar el servidor y comprobar la migración**

Reiniciar `next dev`. Luego, contra la base local:

Run: `node --input-type=module -e "const {createClient}=await import('@libsql/client'); const c=createClient({url:'file:database/data/ugbplus.db'}); console.log((await c.execute('SELECT clave,nombre,orden FROM categorias ORDER BY orden')).rows); console.log((await c.execute('SELECT id,slug,categoria FROM cursos')).rows);"`

Expected: seis categorías en orden 1–6 con los nombres exactos de las restricciones globales, y **todos los cursos que había siguen ahí con su `categoria` intacta**.

- [ ] **Step 3: Comprobar que el `CHECK` ya no está**

Run: el mismo cliente, `INSERT INTO cursos (slug,titulo,categoria,nivel) VALUES ('zz-prueba','Prueba','inventada','Básico')` y después `DELETE FROM cursos WHERE slug='zz-prueba'`.

Expected: el `INSERT` no da error (antes fallaba con `CHECK constraint failed`), y el `DELETE` lo deja limpio.

- [ ] **Step 4: Commit**

```bash
git add src/server/database/migrations/index.ts
git commit -m "feat: tabla de categorias y cursos sin CHECK de categoria"
```

---

### Task 2: Tipo, esquema y repositorio de categorías

**Files:**
- Create: `src/types/category.types.ts`
- Create: `src/schemas/category.schema.ts`
- Create: `src/server/database/repositories/categories.repository.ts`

**Interfaces:**
- Consumes: la tabla `categorias` de la Tarea 1; `slugify` y `SLUG_MAX` de `src/lib/text.ts`; `nowForDatabase` de `src/lib/dates.ts`; `execute`, `queryAll`, `queryOne` de `../connection`.
- Produces:
  ```ts
  // category.types.ts
  export type Category = { id: number; key: string; name: string; order: number; updatedAt: string };

  // category.schema.ts
  export const categorySchema: z.ZodObject<{ name: …; order: … }>;
  export type CategoryInput = z.infer<typeof categorySchema>;   // { name: string; order: number }
  export type CategoryFormField = keyof CategoryInput;

  // categories.repository.ts
  findAll(): Promise<Category[]>                       // ORDER BY orden, nombre
  findById(id: number): Promise<Category | null>
  nextOrder(): Promise<number>
  countAll(): Promise<number>
  exists(key: string): Promise<boolean>
  freeKey(base: string): Promise<string>
  countCourses(key: string): Promise<number>           // visibles y ocultos
  create(input: CategoryInput, key: string): Promise<number>
  update(id: number, input: CategoryInput): Promise<void>   // no toca `clave`
  remove(id: number): Promise<void>
  ```

- [ ] **Step 1: Escribir `category.types.ts` y `category.schema.ts`**

`categorySchema` tiene **solo** `name` y `order`; la clave no es un campo del formulario.

- `name`: `.trim()`, mínimo **2** caracteres ("IA" es un nombre válido — ver Review Focus 2; por eso no se reutiliza `slugField`, que exige 3), máximo 60, y un `.refine` que rechaza los nombres cuyo `slugify()` queda vacío (`"!!!"`), con el mensaje `"Escribe un nombre con letras o números."`.
- `order`: igual que en `partnerSchema` — entero, de 0 a 9999.

- [ ] **Step 2: Escribir `categories.repository.ts`**

Calcado de `partners.repository.ts`: `type CategoriaRow`, `toCategory(row)`, `toRow(input)`.

- `freeKey(base)`: devuelve `base` si está libre; si no, prueba `base-2`, `base-3`… hasta encontrar una libre. Es lo que impide el choque de Review Focus 1.
- `countCourses(key)`: `SELECT COUNT(*) FROM cursos WHERE categoria = ?`, **sin filtrar por `visible`** (Review Focus 3).
- `update` actualiza `nombre`, `orden` y `actualizado_en`, y **no menciona `clave`**.

- [ ] **Step 3: Verificar tipos, lint y el comportamiento del repositorio**

Run: `npm run typecheck && npm run lint`
Expected: ambos sin salida de error.

Run: un script en el directorio de scratchpad que importe el repositorio y ejecute, en orden: `freeKey(slugify("Diseño"))`, luego `create({name:"Diseno", order:9}, await freeKey(slugify("Diseno")))`, luego `freeKey(slugify("Diseno"))`, y por último `remove` de lo creado.

Expected: el primero devuelve `diseno-2` (porque `diseno` ya existe sembrada), la creación funciona, el tercero devuelve `diseno-3`, y la base queda como estaba. Esto fija Review Focus 1.

Run: en el mismo script, `categorySchema.safeParse({ name: "IA", order: 0 })` y `categorySchema.safeParse({ name: "!!!", order: 0 })`.
Expected: el primero `success: true` (Review Focus 2 — con `slugField` habría fallado por el mínimo de 3 caracteres); el segundo `success: false` con el mensaje de "Escribe un nombre con letras o números."

- [ ] **Step 4: Commit**

```bash
git add src/types/category.types.ts src/schemas/category.schema.ts src/server/database/repositories/categories.repository.ts
git commit -m "feat: tipo, esquema y repositorio de categorias"
```

---

### Task 3: `Course` resuelve su categoría por JOIN

**Files:**
- Modify: `src/types/course.types.ts`
- Modify: `src/server/database/repositories/courses.repository.ts`
- Modify: `src/components/public/courses/CourseCard.tsx:39`
- Modify: `src/components/public/courses/CourseDetail.tsx:28`
- Modify: `src/components/admin/courses/CourseTable.tsx:34`
- Modify: `src/app/(public)/cursos/[slug]/page.tsx:36`

**Interfaces:**
- Consumes: la tabla `categorias` de la Tarea 1.
- Produces: `Course` con dos campos nuevos:
  ```ts
  category: string;        // antes: "tecnologia" | "negocios" | "habilidades"
  categoryName: string;    // "" si la categoría ya no existe
  categoryOrder: number;   // 9999 si ya no existe, para que caiga al final
  ```
  `export type CourseCategory = string;` se conserva como alias para no romper importaciones.

- [ ] **Step 1: Ampliar el tipo y el repositorio**

En `course.types.ts`: `CourseCategory` pasa a `string`; `Course` gana `categoryName` y `categoryOrder`.

En `courses.repository.ts`, las **seis** consultas de lectura (`findVisible`, `findAll`, `findRecent`, `findById`, `findVisibleBySlug`, `findFeatured`) pasan de `SELECT * FROM cursos` a:

```sql
SELECT c.*, COALESCE(cat.nombre,'') AS categoria_nombre, COALESCE(cat.orden,9999) AS categoria_orden
FROM cursos c LEFT JOIN categorias cat ON cat.clave = c.categoria
```

Las cláusulas `WHERE`/`ORDER BY` existentes se califican con `c.` donde haga falta. `CourseRow` gana los dos campos y `toCourse` los mapea. `LEFT JOIN` y no `JOIN`: un curso huérfano debe seguir viéndose en el panel.

- [ ] **Step 2: Usar `categoryName` en las cuatro vistas que pintan la etiqueta**

Las cuatro sustituyen `COURSE_CATEGORIES[course.category].label` por `course.categoryName` y **quitan el import** de `@/constants/course-categories`.

En `CourseCard`, `CourseDetail` y `cursos/[slug]/page.tsx` la etiqueta va dentro de un `<Badge>` o de un epígrafe: se envuelven en `course.categoryName && (…)` para no dejar una pastilla vacía (Review Focus 5). En `CourseTable` la etiqueta va en una línea con separadores `·`, así que ahí se omite el segmento si está vacío.

- [ ] **Step 3: Verificar**

Run: `npm run typecheck && npm run lint`
Expected: sin errores. `constants/course-categories.ts` sigue existiendo (lo usan `CourseForm` y `CourseFilters`, que se tocan en las tareas 4 y 6).

Run: abrir `http://localhost:3000/#programas` y `http://localhost:3000/admin/cursos`.
Expected: cada curso muestra el nombre de su categoría igual que antes del cambio.

- [ ] **Step 4: Comprobar el curso huérfano (Review Focus 5)**

Run: en la base local, `UPDATE cursos SET categoria='fantasma' WHERE id=(SELECT MIN(id) FROM cursos)`; recargar la landing y `/admin/cursos`; después devolverlo a su categoría original.

Expected: en la landing ese curso aparece **sin pastilla de categoría** (no una pastilla vacía) y en el panel sigue listado. Nada lanza error.

- [ ] **Step 5: Commit**

```bash
git add src/types/course.types.ts src/server/database/repositories/courses.repository.ts src/components/public/courses/CourseCard.tsx src/components/public/courses/CourseDetail.tsx src/components/admin/courses/CourseTable.tsx "src/app/(public)/cursos/[slug]/page.tsx"
git commit -m "feat: el curso trae resuelto el nombre de su categoria"
```

---

### Task 4: Filtros de la landing deducidos de los cursos

**Files:**
- Modify: `src/components/public/courses/CourseFilters.tsx`
- Modify: `src/components/public/courses/CourseGrid.tsx`

**Interfaces:**
- Consumes: `Course.category`, `Course.categoryName`, `Course.categoryOrder` de la Tarea 3.
- Produces:
  ```ts
  export type CourseFilter = string | null;   // null = "Todos"
  type CourseFiltersProps = {
    value: CourseFilter;
    options: { key: string; label: string; count: number }[];   // sin "Todos": lo añade el propio componente
    total: number;                                              // cuántos cursos hay en total
    onChange: (filter: CourseFilter) => void;
  };
  ```

- [ ] **Step 1: Reescribir el cálculo de las pastillas en `CourseGrid`**

El `useMemo` de `counts` se sustituye por uno que recorre `courses` y construye `options`: una entrada por cada `category` distinta que aparezca, con `label: course.categoryName` y `count`, **ordenadas por `categoryOrder` y, a igualdad, por `label`**. Las categorías sin cursos visibles no salen; es justo lo que evita una barra llena de filtros vacíos.

Los cursos huérfanos (`categoryName === ""`) no generan pastilla.

`filter` arranca en `null` y el filtrado pasa a `filter === null ? courses : courses.filter((c) => c.category === filter)`. El botón "Ver todos los cursos" del estado vacío llama a `setFilter(null)`.

- [ ] **Step 2: Adaptar `CourseFilters` a la nueva forma**

Quita el import de `@/constants/course-categories`. La lista de botones pasa a `[{ key: null, label: "Todos", count: total }, ...options]`. El `key` de React para la pastilla "Todos" es una cadena fija, porque `null` no vale como `key`.

El centinela deja de ser `"all"`: con claves libres, una categoría llamada "All" habría generado esa clave y su pastilla se habría comportado como "ver todos".

- [ ] **Step 3: Verificar**

Run: `npm run typecheck && npm run lint`
Expected: sin errores.

Run: abrir `http://localhost:3000/#programas`.
Expected: salen "Todos" y **solo** las categorías que tienen cursos visibles — no las seis. Los contadores cuadran. Pulsar cada pastilla filtra; "Todos" los devuelve.

- [ ] **Step 4: Commit**

```bash
git add src/components/public/courses/CourseFilters.tsx src/components/public/courses/CourseGrid.tsx
git commit -m "feat: la barra de filtros sale de los cursos, no de una lista fija"
```

---

### Task 5: Sección Categorías en el panel

**Files:**
- Create: `src/server/actions/categories.actions.ts`
- Create: `src/app/admin/(panel)/categorias/page.tsx`
- Create: `src/app/admin/(panel)/categorias/nuevo/page.tsx`
- Create: `src/app/admin/(panel)/categorias/[id]/editar/page.tsx`
- Create: `src/components/admin/categories/CategoryTable.tsx`
- Create: `src/components/admin/categories/CategoryForm.tsx`
- Create: `src/components/admin/categories/DeleteCategoryButton.tsx`
- Modify: `src/constants/admin-nav.ts`

**Interfaces:**
- Consumes: todo el repositorio de la Tarea 2; `requireSession` de `@/server/auth/dal`; `parseForm`, `readId` de `@/server/forms`; `ConfirmDeleteButton`, `ListRow`, `Pill`, `EditLink`, `EmptyState` de `@/components/admin/ui/…`; `PageHeader`, `FlashFromParams`.
- Produces:
  ```ts
  export type CategoryFormState = FormState<CategoryFormField>;
  createCategoryAction(prev, formData): Promise<CategoryFormState>
  updateCategoryAction(id, prev, formData): Promise<CategoryFormState>
  deleteCategoryAction(formData): Promise<void>
  ```

- [ ] **Step 1: Escribir las acciones**

Modelo: `partners.actions.ts`. `refreshPages()` revalida `/`, `/admin/categorias` y `/admin/cursos`.

Tres reglas propias, todas en el servidor porque no hay clave foránea en Turso:

- `createCategoryAction` genera la clave con `repo.freeKey(slugify(data.name))` y la pasa a `repo.create`.
- `updateCategoryAction` no toca la clave.
- `deleteCategoryAction` comprueba, **antes de borrar**, en este orden:
  1. `await repo.countAll() <= 1` → redirige a `/admin/categorias?ultima=1` sin borrar.
  2. `await repo.countCourses(categoria.key) > 0` → redirige a `/admin/categorias?enUso=<n>` sin borrar.

  `deleteCategoryAction` devuelve `void` (es una acción de formulario suelto, como `deletePartnerAction`), por eso el aviso viaja en la URL y no en un `FormState`.

- [ ] **Step 2: Escribir las tres pantallas y los tres componentes**

Calcadas de las de Aliados.

- `CategoryTable`: una `ListRow` por categoría con el nombre, un `Pill` con la clave (informativo, para que se entienda que no cambia al renombrar), "Posición N" y el `EditLink`. `EmptyState` si no hay ninguna.
- `CategoryForm`: `Input` de nombre e `Input` numérico de posición. **No muestra la clave como campo editable.** En el alta, una nota de una línea: la dirección interna se genera del nombre y no cambia al renombrar.
- `DeleteCategoryButton`: `ConfirmDeleteButton` con `question="¿Eliminar esta categoría?"`, explicando que los cursos que la usen impiden el borrado.
- Los dos avisos de bloqueo **no** pasan por `FlashFromParams`: ese componente solo reconoce `?param=1` (no admite el número de `?enUso=3`) y pinta en verde de éxito, que es el tono equivocado para un borrado rechazado. La página de listado los renderiza ella misma, justo debajo del `FlashFromParams` de siempre, con un `<p role="status">` de estilo de advertencia (`border-danger/20 bg-danger/8 text-danger` y un `TriangleAlert`, en espejo de `FlashMessage`):
  - `?ultima=1` → "No puedes eliminar la última categoría: sin ninguna no se podrían crear cursos."
  - `?enUso=<n>` → "No se eliminó: N curso(s) usan esta categoría. Cámbiales la categoría primero." (singular/plural según `n`).

- [ ] **Step 3: Añadir la entrada al menú**

En `ADMIN_NAV`, justo **después** de `/admin/cursos`: `{ href: "/admin/categorias", label: "Categorías", icon: Tags }` (importar `Tags` de lucide-react). Sin `soloAdmin`: quien puede editar cursos puede editar sus categorías.

Ojo con `AdminSidebar`: marca activo con `pathname.startsWith(href)`, y `/admin/cursos` no es prefijo de `/admin/categorias`, así que no hay conflicto.

- [ ] **Step 4: Verificar el camino feliz**

Run: `npm run typecheck && npm run lint`, luego en `http://localhost:3000/admin/categorias`: crear una categoría "Idiomas", renombrarla a "Idiomas y Comunicación", cambiarle la posición, y borrarla.

Expected: aparece en la lista con clave `idiomas`; al renombrarla **la clave sigue siendo `idiomas`**; el orden se guarda; se borra sin queja porque no tiene cursos.

- [ ] **Step 5: Comprobar las dos reglas de borrado (Review Focus 3 y 4)**

Run: crear la categoría "Prueba", asignarla a un curso desde `/admin/cursos` y **dejar ese curso oculto**; intentar borrar "Prueba".
Expected: no se borra y el aviso dice que **1 curso** la usa, aunque no se vea en la landing.

Run: en la base local, dejar una sola categoría (`DELETE FROM categorias WHERE clave != 'tecnologia'`, tras mover los cursos a `tecnologia`); intentar borrarla; después restaurar con `git stash`/re-sembrado o borrando el archivo `.db` para que las migraciones lo rehagan.
Expected: no se borra, y el aviso explica que es la última.

- [ ] **Step 6: Commit**

```bash
git add src/server/actions/categories.actions.ts "src/app/admin/(panel)/categorias" src/components/admin/categories src/constants/admin-nav.ts
git commit -m "feat: seccion de categorias en el panel"
```

---

### Task 6: El formulario de curso se alimenta de la tabla

**Files:**
- Modify: `src/components/admin/courses/CourseForm.tsx`
- Modify: `src/app/admin/(panel)/cursos/nuevo/page.tsx`
- Modify: `src/app/admin/(panel)/cursos/[id]/editar/page.tsx`
- Modify: `src/schemas/course.schema.ts`
- Modify: `src/server/actions/courses.actions.ts`
- Delete: `src/constants/course-categories.ts`

**Interfaces:**
- Consumes: `Category` y `categories.repository` de la Tarea 2.
- Produces: `CourseForm` gana una prop obligatoria `categories: Category[]`.

- [ ] **Step 1: Pasar las categorías al formulario**

Las dos páginas de curso llaman a `categoriesRepo.findAll()` y lo pasan como prop. En `CourseForm`, el `Select` de categoría toma `options={categories.map((c) => c.name)}` y `values={categories.map((c) => c.key)}`, y se quita el import de `@/constants/course-categories`.

Si `categories.length === 0`, el formulario pinta en lugar del `Select` un aviso con enlace a `/admin/categorias`: no se puede crear un curso sin categorías. Es la salida de emergencia por si alguna base llega a cero pese a la regla de la Tarea 5.

- [ ] **Step 2: Cambiar la validación**

En `course.schema.ts`, `category` pasa de `z.enum(COURSE_CATEGORY_KEYS, …)` a una cadena no vacía con el mensaje `"Selecciona una categoría."`. Se quita el import de la constante.

En `courses.actions.ts`, `createCourseAction` y `updateCourseAction` comprueban, tras el `parseForm` y junto a la comprobación de slug que ya existe:

```ts
if (!(await categoriesRepo.exists(parsed.data.category))) {
  return { values: parsed.values, fields: { category: "Esa categoría ya no existe." } };
}
```

Aquí y no en el esquema: hacerlo en Zod exigiría un esquema asíncrono y tocar `parseForm`, que usan todos los formularios del panel.

- [ ] **Step 3: Borrar la constante**

`git rm src/constants/course-categories.ts`. A estas alturas no debe quedar ninguna importación.

Run: `grep -rn "course-categories" src/`
Expected: sin resultados.

- [ ] **Step 4: Verificar**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: los tres sin errores. El `build` aquí y no antes porque es el primer momento en que el proyecto no tiene la constante.

Run: en `/admin/cursos/nuevo`, abrir el desplegable de categoría.
Expected: salen las **seis** categorías sembradas, en el orden configurado. Crear un curso con "Humanidades" y comprobar que aparece en la landing con esa pastilla.

- [ ] **Step 5: Comprobar la categoría desaparecida**

Run: abrir `/admin/cursos/<id>/editar` en dos pestañas; en una, borrar la categoría de ese curso desde `/admin/categorias` (hay que dejar el curso en otra antes, por la regla de uso); en la otra, pulsar Guardar con el valor viejo todavía en el desplegable.

Expected: no se guarda y sale "Esa categoría ya no existe." bajo el campo Categoría, en vez de dejar el curso apuntando a algo inexistente.

- [ ] **Step 6: Commit**

```bash
git add -A src/components/admin/courses/CourseForm.tsx "src/app/admin/(panel)/cursos" src/schemas/course.schema.ts src/server/actions/courses.actions.ts src/constants/course-categories.ts
git commit -m "feat: el formulario de curso toma las categorias de la base"
```

---

## Cierre

- [ ] **Actualizar el README** si lista las secciones del panel, añadiendo Categorías.
- [ ] **Revisión final:** `npm run typecheck && npm run lint && npm run build`, y un recorrido completo — crear categoría, asignarla a un curso, verla en la landing, renombrarla y comprobar que el curso la sigue, intentar borrarla y recibir el bloqueo.
