# Checklist manual — Mercado Pago Checkout Pro (reservas)

Configurá antes `MERCADOPAGO_ACCESS_TOKEN`, `APP_BASE_URL`, `MONGODB_URI`, `MONGODB_DB` y (recomendado) `CRON_SECRET`.

Para probar webhooks en local, `APP_BASE_URL` tiene que ser una URL **pública HTTPS** (por ejemplo un túnel con ngrok) apuntando a tu `next dev`; Mercado Pago no puede llamar a `localhost` directamente.

## 1. Crear reserva pendiente y preferencia

1. Abrí `/reservar`, completá el formulario con un día hábil válido y enviá.
2. Deberías ser redirigido al **Checkout Pro** de Mercado Pago (URL `mercadopago.com` / `mercadopago.com.ar`).
3. En MongoDB, el documento en `turnos` debe tener `estado: "pending_payment"`, `mpExternalReference` tipo `jgv_turno_<hex>`, `paymentExpiresAt` y, tras el segundo paso, `mpPreferenceId`.

## 2. Webhook (notificación)

1. En el panel de Mercado Pago, configurá la **URL de notificación** igual a:  
   `{APP_BASE_URL}/api/webhooks/mercadopago`  
   (debe ser HTTPS público en producción).
2. Completá un pago de prueba o producción según tu cuenta.
3. Verificá logs del servidor (`[mp-webhook]`, `[mp-preference]`).
4. En MongoDB, colección `mp_webhook_events`: entradas con `outcome` (`confirmed`, `already_confirmed`, `not_approved`, etc.).
5. El turno debe pasar a `estado: "confirmed"` **solo** si el pago figura `approved` en la API de MP y el monto coincide con `montoTotalVisitaArs`.

## 3. back_urls (solo UX)

1. Tras pagar, volvé con éxito a `/reservar?mp=success`.
2. Confirmá que el mensaje informativo se muestra y que **el estado en Mongo sigue siendo la fuente de verdad** (no confiar en la URL para confirmar).

## 4. Idempotencia

1. Reenviá manualmente la misma notificación (mismo `payment id`) o repetí el flujo que dispare duplicados.
2. El segundo procesamiento debe registrar `already_confirmed` en auditoría y **no** duplicar efectos en el turno.

## 5. Expiración

1. Creá una reserva `pending_payment` con `paymentExpiresAt` en el pasado (o esperá el plazo).
2. Llamá: `GET {APP_BASE_URL}/api/cron/expire-reservations` con header  
   `Authorization: Bearer {CRON_SECRET}`.
3. Esa reserva debe pasar a `estado: "expired"`.

## 6. Endpoint deprecado

1. `POST /api/turnos` debe responder **410** con mensaje de migración a `/api/reservas/pending`.

## Índices recomendados (MongoDB)

- `turnos`: índice único sparse en `mpExternalReference` (si no existe ya).
- `mp_payments`: índice único en `mpPaymentId`.
