export default function PickupSelection() {
  const stores = [
    { id: 1, name: "Tienda Central - Miraflores", address: "Av. Larco 123, Lima" },
    { id: 2, name: "Tienda Norte - Los Olivos", address: "Av. Universitaria 999, Lima" },
  ];

  return (
    <div className="bg-[#413F39]/40 p-8 rounded-2xl shadow-md text-[#F5F5F5]">

      <div className="space-y-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="p-4 border border-[#C0A648]/40 bg-[#333027] rounded-xl hover:border-[#EBC431] hover:bg-[#413F39]/60 cursor-pointer transition"
          >
            <p className="font-semibold text-[#EBC431]">{store.name}</p>
            <p className="text-sm text-[#F5F5F5]/70">{store.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
