/** Bloquea el scroll sin cambiar el ancho del layout (evita el salto de la scrollbar). */
export function lockBodyScroll(): () => void {
  const { body, documentElement: doc } = document;
  const scrollY = window.scrollY;
  const lockedWidth = doc.clientWidth;

  const prev = {
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    docOverflow: doc.style.overflow,
  };

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "auto";
  body.style.width = `${lockedWidth}px`;
  body.style.overflow = "hidden";
  body.style.paddingRight = "0";
  doc.style.overflow = "hidden";

  return () => {
    body.style.position = prev.bodyPosition;
    body.style.top = prev.bodyTop;
    body.style.left = prev.bodyLeft;
    body.style.right = prev.bodyRight;
    body.style.width = prev.bodyWidth;
    body.style.overflow = prev.bodyOverflow;
    body.style.paddingRight = prev.bodyPaddingRight;
    doc.style.overflow = prev.docOverflow;
    window.scrollTo(0, scrollY);
  };
}
