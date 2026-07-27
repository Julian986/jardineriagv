# Analytics de la tienda (GA4)

Eventos del ecommerce `/tienda`. Solo se envían en **producción** (`NODE_ENV=production` + `NEXT_PUBLIC_GA_MEASUREMENT_ID`).

## Eventos

| Evento GA4 | Cuándo | Parámetros útiles |
| --- | --- | --- |
| `tienda_click` | Clicks de UI (botones/links) | `button`, `location`, `product_id`, `product_name`, `value` |
| `add_to_cart` | Agregar al carrito (catálogo o ficha) | `currency=ARS`, `value`, `items[]`, `location` |
| `view_cart` | Abrir el carrito (header) | `value`, `items[]`, `location=header` |
| `begin_checkout` | “Iniciar compra” | `value`, `items[]`, `location=cart_drawer` |
| `add_payment_info` | “Continuar al pago” → Mercado Pago | `payment_type=mercadopago`, `entrega`, `pedido_id`, `value` |
| `purchase` | Página gracias (pending/confirmed) | `transaction_id` (= pedido_id), `status` |
| `remove_from_cart` | Eliminar ítem del carrito | `items[]`, `location` |
| `whatsapp_click` | Consultar por WhatsApp (ficha / FAB) | `location`, `page`, `product_id`, `product_name` |

Valores frecuentes de `button` en `tienda_click`: `agregar_al_carrito`, `carrito`, `iniciar_compra`, `continuar_al_pago`, `seguir_comprando`, `ver_producto`, `filtrar_categoria`, `mostrar_carrusel`, `ocultar_carrusel`, `volver_sitio`, `volver_productos`.

Helper: [`src/lib/tienda/analytics.ts`](../src/lib/tienda/analytics.ts).

## Cómo ver clicks y ciudad en Google Analytics

La **ciudad no se manda desde el sitio**: GA4 la infiere por IP en cada sesión.

1. Entrá a [Google Analytics](https://analytics.google.com) → propiedad de Jardinería GV.
2. **Informes → Tiempo real → Eventos**: para verificar que llegan (después del deploy).
3. **Explorar → Exploración libre** (recomendado):
   - Dimensiones: `Nombre del evento`, `Ciudad`, y parámetros personalizados (`button`, `location`) si los registrás.
   - Métrica: `Recuento de eventos`.
4. Para un evento concreto: **Informes → Interacción → Eventos** → abrí `tienda_click` o `add_to_cart`.
5. Cruce geográfico: **Informes → Datos demográficos → Datos demográficos detallados** (o exploración con dimensión `Ciudad` + filtro de evento).

### Registrar parámetros personalizados (una vez)

Para filtrar por `button` / `location` en informes:

1. Admin → Definiciones personalizadas → Crear dimensión personalizada.
2. Ámbito: **Evento**.
3. Parámetro del evento: `button`, `location`, `product_name`, etc.

Sin este paso igual llegan los eventos; solo no aparecen como columnas fáciles en informes estándar.

## Nota

En local / `next dev` **no** se disparan eventos (mismo criterio que el resto del sitio). Para probar: deploy a producción o Preview con `NODE_ENV=production` y el Measurement ID cargado.
