import { PanelTiendaProductoForm } from "@/components/panel-tienda/PanelTiendaProductoForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PanelTiendaEditarProductoPage({ params }: PageProps) {
  const { id } = await params;
  return <PanelTiendaProductoForm mode="edit" productoId={id} />;
}
