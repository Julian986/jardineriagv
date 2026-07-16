# Plan — Ecommerce Jardinería GV

**Estado:** en desarrollo (paso 1 — catálogo base)  
**Fecha:** julio 2026  
**Cliente:** Guillermo (Guille)  
**Plan contratado:** Opción 1 — Tienda Online Esencial ($60.000 ARS)  
**Referencia visual oficial (catálogo):** `public/ecommerce terekua/imagen_diseño.png`  
**Referencia online:** [terekua.com.ar](https://www.terekua.com.ar)  
**Propuesta base:** `docs/Propuesta_Ecommerce_JardineriaGV.pdf`

### Nota sobre la referencia visual (acordado con Guille)

La captura de Terekua es el **layout objetivo** del catálogo: header de tienda, sidebar de categorías, grilla de cards.  
**No** se copian logo ni colores de Terekua: se usa identidad JGV (`#2d4a22`, `#c4933f`, `BrandLogo`).

| Elemento en la captura | Opción 1 (ahora) | Plan Plus (después) |
|------------------------|------------------|----------------------|
| Grilla de productos + cards | Sí | Sí |
| Sidebar categorías | Sí | Sí |
| Barra superior promos | Sí (copy JGV) | Sí |
| Header logo + carrito | Sí (carrito visual, sin lógica aún) | Sí |
| Buscador central | Solo visual / deshabilitado | Funcional |
| Ordenar por | No | Sí |
| Filtros color / marca / precio | No | Parcial |

### Enfoque de desarrollo (iterativo)

1. **Paso 1 (hecho):** `/tienda` — catálogo base como la imagen, datos demo, botón en home.  
2. **Paso 2 (hecho):** carrito drawer tipo Terekua (agregar, cantidades, eliminar, persistencia local).  
3. Paso 3: pulir carrito / catálogo (detalles visuales).  
4. Paso 4: página de producto.  
5. Paso 5: checkout Mercado Pago (“Iniciar compra”).  
6. Paso 6: panel admin + datos reales.

---

## 1. Objetivo

Incorporar una **tienda online propia** dentro de `jardineriagv.com`, integrada al sitio actual, con diseño y experiencia de compra **equivalentes a Terekua** (catálogo, cards, detalle, carrito), pero con la **identidad visual de Jardinería GV** (verdes, dorado, tipografía del rediseño).

Guille debe poder **cargar, editar y eliminar productos** desde un panel admin, sin depender de desarrollo para cada alta.

---

## 2. Alcance contratado (Opción 1)

| Incluido | Descripción |
|----------|-------------|
| Catálogo | Listado de productos por categoría |
| Página de producto | Detalle con fotos, precio, descripción, CTA compra |
| Panel de administración | Acceso protegido para Guille |
| ABM de productos | Alta, baja, modificación |
| Categorías | Organización del catálogo |
| Carrito | Agregar/quitar productos, ver total |
| Mercado Pago | Checkout con Checkout Pro |
| Responsive | Mobile, tablet, desktop |

### Incluido en todos los planes (propuesta)

- Diseño integrado a la identidad JGV  
- Panel autogestionable  
- Integración Mercado Pago  
- Next.js a medida (sin TiendaNube/Shopify)  
- Responsive  

### Fuera de alcance (Opción 1)

No forman parte de este desarrollo salvo acuerdo aparte:

| Feature | Plan que lo incluye |
|---------|---------------------|
| Buscador | Plus |
| Filtros avanzados | Plus |
| Ordenamiento (precio, nombre…) | Plus |
| Sección “productos destacados” configurable | Plus |
| Panel de estadísticas / ventas | Premium |
| Cuentas de usuario (“Mi cuenta”) | No contemplado |
| Calculadora de envío por CP | No contemplado (Terekua lo tiene; no está en propuesta) |
| Cupones / descuentos | No contemplado |
| Variantes complejas (talle, color, medida a medida) | Simplificar en MVP |

---

## 3. Referencia Terekua — qué replicar y qué adaptar

Terekua corre sobre TiendaNube. No copiamos la plataforma; replicamos **patrones de UX** que el cliente ya conoce y le gustan.

### Replicar (estructura y flujo)

1. **Header tienda:** logo, menú de categorías, ícono carrito con cantidad  
2. **Home/catálogo:** grilla de productos en cards  
3. **Card de producto:** imagen, nombre, precio, badge opcional (ej. “Sin stock”)  
4. **Página de producto:** galería, título, precio, descripción, botón “Agregar al carrito”  
5. **Carrito:** lista de ítems, cantidades, subtotal, botón ir a pagar  
6. **Checkout:** redirección a Mercado Pago  
7. **Estados de stock:** visible / sin stock (deshabilitar compra)

### Adaptar a Jardinería GV

- Colores, logo y tipografía del **rediseño actual** (`RedesignHeader`, `RedesignFooter`, paleta `#2d4a22` / `#c4933f`)  
- Productos serán de **Jardinería GV** (plantas, insumos, madera, etc.), no catálogo Terekua  
- Sin banner promocional countdown de Terekua salvo que Guille lo pida después  
- Sin “Mi cuenta” ni login de comprador en v1  
- Envío: **coordinación post-venta** (como el flujo actual de madera: Guille contacta para entrega), salvo que definan otra cosa  

### Convivencia con el bloque Terekua actual

Hoy el sitio deriva a Terekua (`TerekuaMvpBlock`) como aliado. Definir con Guille:

- **A)** Mantener Terekua para categorías que no vende JGV y la tienda propia para el resto  
- **B)** Reemplazar gradualmente el bloque Terekua por la tienda propia  
- **C)** Mantener ambos en paralelo indefinidamente  

*Recomendación:* empezar con **A o C** y revisar tras las primeras ventas.

---

## 4. Situación actual del proyecto (punto de partida)

Ya existe infraestructura reutilizable:

| Pieza | Ubicación | Uso para ecommerce |
|-------|-----------|-------------------|
| Next.js 16 + App Router | — | Base del desarrollo |
| MongoDB | `lib/db` | Productos, categorías, pedidos |
| Mercado Pago Checkout Pro | `lib/mercadopago/*` | Pago del carrito |
| Flujo pending → preference → webhook | madera + reservas | Modelo de checkout |
| Panel admin + auth | `panel-turnos`, `panel-auth` | Patrón para `panel-tienda` |
| Design system | `components/redesign/*` | Layout tienda pública |
| Checkout single-product | `MaderaCheckoutForm` | Referencia de UI y validación |

**No existe aún:** carrito multi-ítem, catálogo dinámico, CRUD de productos, categorías en DB.

---

## 5. Arquitectura de rutas propuesta

### Tienda pública

```
/tienda                          → Catálogo (todas las categorías o vista general)
/tienda/categoria/[slug]           → Productos de una categoría
/tienda/producto/[slug]          → Detalle de producto
/tienda/carrito                  → Carrito y resumen
/tienda/checkout                 → Datos del comprador + ir a MP (o paso integrado en carrito)
/tienda/gracias                  → Confirmación post-pago (success)
```

*Alternativa más corta:* `/tienda/[slug]` solo para producto y `/tienda?categoria=` para filtro. La estructura de arriba es más clara para SEO y navegación tipo Terekua.

### Panel admin

```
/panel-tienda/login              → Login (misma contraseña que turnos o una nueva — ver decisiones)
/panel-tienda                    → Dashboard: listado de productos y pedidos
/panel-tienda/productos/nuevo
/panel-tienda/productos/[id]     → Editar producto
/panel-tienda/categorias         → ABM categorías
/panel-tienda/pedidos            → Listado de ventas (mínimo: ver estado; sin estadísticas Premium)
```

### APIs

```
GET/POST        /api/tienda/productos          → Público (solo activos) / Admin
GET/PATCH/DELETE /api/tienda/productos/[id]     → Admin
GET/POST        /api/tienda/categorias          → Público + Admin
POST            /api/tienda/pedidos/pending      → Crear pedido desde carrito
POST            /api/tienda/pedidos/[id]/preference → Preferencia MP
POST            /api/tienda/pedidos/confirm-payment → Respaldo post-retorno
```

Webhook existente: extender `api/webhooks/mercadopago` para pedidos de tienda (`jgv_tienda_{id}`).

---

## 6. Modelo de datos (MongoDB)

### Colección `tienda_categorias`

```ts
{
  _id: ObjectId,
  nombre: string,           // ej. "Plantas"
  slug: string,             // ej. "plantas"
  descripcion?: string,
  imagen?: string,          // URL path en /public o storage
  orden: number,            // para ordenar en menú
  activa: boolean,
  createdAt, updatedAt
}
```

### Colección `tienda_productos`

```ts
{
  _id: ObjectId,
  nombre: string,
  slug: string,
  descripcion: string,
  descripcionCorta?: string,
  precioArs: number,        // entero, pesos argentinos
  categoriaId: ObjectId,
  imagenes: string[],       // paths o URLs, mínimo 1
  stock: number | null,     // null = sin control de stock
  activo: boolean,
  createdAt, updatedAt
}
```

### Colección `tienda_pedidos`

```ts
{
  _id: ObjectId,
  items: [{
    productoId: ObjectId,
    nombre: string,         // snapshot al momento de la compra
    precioUnitarioArs: number,
    cantidad: number,
  }],
  subtotalArs: number,
  feeMpArs?: number,        // si el comprador absorbe comisión (como madera)
  totalArs: number,
  comprador: {
    nombre: string,
    celular: string,
    email?: string,
    notas?: string,
  },
  estado: "pending_payment" | "paid" | "cancelled" | "expired",
  mpPreferenceId?: string,
  mpPaymentId?: string,
  createdAt, updatedAt, paidAt?
}
```

Reutilizar `mp_payments` y `mp_webhook_events` con `domain: "tienda"`.

---

## 7. Flujos principales

### 7.1 Compra (cliente)

```
Catálogo → Detalle → Agregar al carrito → Carrito → Completar datos
  → POST pedido pending → POST preference MP → Redirect Checkout Pro
  → Webhook / retorno → estado paid → página gracias
  → Guille recibe notificación (WhatsApp manual o email futuro)
```

**Carrito:** estado en cliente (`localStorage` + React Context). Sin login. Al pagar se valida stock y precios en servidor.

### 7.2 Administración (Guille)

```
Login panel → Productos: listar / crear / editar / desactivar
           → Categorías: listar / crear / editar / ordenar
           → Pedidos: ver listado, estado de pago, datos del comprador
```

### 7.3 Imágenes de productos (MVP)

**Opción recomendada para v1:** subida de archivos al servidor (`/public/tienda/...`) desde el panel, o carga de URL/path manual si queremos ir más rápido en la primera iteración.

**Opción posterior:** Vercel Blob / Cloudinary.

---

## 8. Diseño UI — desglose por pantalla

### Catálogo (`/tienda`)

- Header tienda (compartido con resto del sitio o header dedicado estilo Terekua)
- Menú horizontal o dropdown de **categorías**
- Grilla responsive: 2 cols mobile, 3–4 desktop
- Card: imagen, nombre, precio formateado `$XX.XXX`
- Badge “Sin stock” si `stock === 0`

### Detalle (`/tienda/producto/[slug]`)

- Galería (imagen principal + thumbnails si hay más de una)
- Nombre, precio, descripción
- Selector de cantidad (mín. 1, máx. stock)
- CTA “Agregar al carrito”
- Breadcrumb: Tienda > Categoría > Producto

### Carrito

- Lista editable (cantidad, eliminar)
- Subtotal
- Botón “Finalizar compra”
- Drawer lateral en mobile (como Terekua) **o** página dedicada — *decisión de UX*

### Panel admin

- Mismo patrón visual que `panel-turnos` (simple, funcional, mobile-friendly)
- Formularios con validación Zod
- Tabla de productos con acciones editar / desactivar / eliminar

---

## 9. Fases de implementación sugeridas

### Fase 0 — Definiciones con Guille (1 reunión / mensaje)

- [ ] Confirmar convivencia con bloque Terekua  
- [ ] Confirmar si madera (`/muebles-madera-recuperada`) migra a la tienda o sigue aparte  
- [ ] Confirmar manejo de envío post-venta  
- [ ] Definir categorías iniciales (ej. Plantas, Macetas, Insumos, Madera…)  
- [ ] Confirmar si absorbe comisión MP el comprador (como madera) o el vendedor  
- [ ] Credenciales MP producción listas  

### Fase 1 — Fundación (backend + admin)

- Modelo MongoDB + APIs categorías y productos  
- Panel login (reutilizar `panel-auth`)  
- ABM categorías  
- ABM productos (sin imágenes sofisticadas: path o upload básico)  

**Entregable:** Guille puede cargar productos reales.

### Fase 2 — Tienda pública

- Layout tienda (header con carrito, footer JGV)  
- Página catálogo + filtro por categoría  
- Página detalle de producto  
- Diseño alineado a Terekua + identidad JGV  

**Entregable:** catálogo navegable, sin compra aún.

### Fase 3 — Carrito y checkout

- Context + persistencia carrito  
- Página/drawer carrito  
- Flujo pedido + Mercado Pago multi-ítem  
- Webhook + página de gracias  
- Listado de pedidos en panel  

**Entregable:** compra end-to-end en staging.

### Fase 4 — Pulido y publicación

- Responsive QA (mobile primero)  
- SEO básico (metadata por producto/categoría)  
- Integrar “Tienda” en menú del sitio (`RedesignNavDrawer`)  
- Pruebas MP sandbox → producción  
- Carga de productos reales con Guille  

**Entregable:** tienda en producción.

---

## 10. Decisiones abiertas

| # | Tema | Opciones | Recomendación |
|---|------|----------|---------------|
| 1 | Ruta base | `/tienda` vs `/productos` | `/tienda` |
| 2 | Carrito | Drawer vs página | Página en v1 (más simple); drawer en iteración |
| 3 | Auth panel | Misma clave que turnos vs clave separada | Misma infra, clave separada opcional |
| 4 | Madera actual | Integrar a tienda vs mantener página propia | Mantener aparte al inicio; unificar después |
| 5 | Stock | Control estricto vs informativo | Estricto si `stock` definido; ocultar “Agregar” en 0 |
| 6 | Imágenes | Upload panel vs path manual | Upload básico en Fase 1 |
| 7 | Pedidos | ¿Email a Guille al pagar? | Fuera de Opción 1; WhatsApp manual al inicio |

---

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| “Idéntico a Terekua” genera expectativa pixel-perfect | Aclarar: misma **experiencia**, branding JGV |
| Scope creep (envíos, cupones, buscador) | Lista explícita fuera de alcance; cambios = presupuesto nuevo (propuesta) |
| Imágenes pesadas / pixeladas | Guía de tamaños mínimos; reutilizar `redesign-image` |
| Doble checkout (madera + tienda) | Documentar qué vende cada canal |
| Stock desactualizado | Validar en servidor al crear pedido |

---

## 12. Criterios de aceptación (Opción 1)

El proyecto se considera entregado cuando:

1. Guille puede **crear, editar y eliminar** productos y categorías desde el panel  
2. Un visitante puede **navegar el catálogo**, ver el **detalle** y **agregar al carrito**  
3. Puede **completar una compra** con Mercado Pago en mobile y desktop  
4. El pedido queda **registrado** en el panel con estado de pago  
5. El diseño es **coherente con Terekua en estructura** y con **JGV en identidad**  
6. El sitio es **responsive**  

---

## 13. Próximo paso

1. Validar este plan con Guille (decisiones §10).  
2. Acordar categorías y productos piloto para la primera carga.  
3. Comenzar **Fase 1** (backend + panel admin).  

---

*Documento vivo — actualizar según feedback de Guille y avance del desarrollo.*
