import EmptyStateCard from "../EmptyStateCard";

export default function EmptyStateCardExample() {
  return (
    <div className="p-6 max-w-md">
      <EmptyStateCard
        title="Contenido en Desarrollo"
        description="Esta sección estará disponible próximamente. Actualmente nos enfocamos en la funcionalidad principal de gestión de molinos."
      />
    </div>
  );
}