import MapTabs from "../MapTabs";

export default function MapTabsExample() {
  const establishments = [
    { id: "1", name: "La Juanita" },
    { id: "2", name: "Don Timoteo" },
  ];

  const handleAddEstablishment = () => {
    console.log("Adding new establishment");
  };

  return (
    <div className="p-6 max-w-4xl">
      <MapTabs 
        establishments={establishments}
        onAddEstablishment={handleAddEstablishment}
      />
    </div>
  );
}