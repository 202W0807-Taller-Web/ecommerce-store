import { useState } from "react";
import { useAddresses, type Address, type AddressForm } from "../hooks/useAddresses";

export default function ShippingForm() {
  const API_URL = "https://tu-api.com/api/direcciones";
  const { addresses, loading, createAddress, updateAddress, deleteAddress } = useAddresses(API_URL);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<AddressForm>>({ principal: false });

  const FIELDS: { key: keyof AddressForm; placeholder: string }[] = [
    { key: "direccion", placeholder: "Dirección" },
    { key: "distrito", placeholder: "Distrito" },
    { key: "provincia", placeholder: "Provincia" },
    { key: "codigoPostal", placeholder: "Código postal" },
    { key: "pais", placeholder: "País" },
    { key: "referencia", placeholder: "Referencia (opcional)" },
  ];

  const setField = <K extends keyof AddressForm>(key: K, value: AddressForm[K]) =>
    setNewAddress((prev) => ({ ...prev, [key]: value }));

  const openModal = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setNewAddress(address);
    } else {
      setEditingId(null);
      setNewAddress({ principal: false });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewAddress({ principal: false });
  };

  const handleSave = async () => {
    if (!newAddress.direccion || !newAddress.distrito) return;
    if (editingId) {
      await updateAddress(editingId, newAddress as AddressForm);
    } else {
      await createAddress(newAddress as AddressForm);
    }
    closeModal();
  };

  return (
    <div className="bg-[#413F39]/50 p-8 rounded-2xl shadow-lg text-[#F5F5F5]">

      {loading ? (
        <p className="italic text-[#F5F5F5]/70">Cargando direcciones...</p>
      ) : addresses.length > 0 ? (
        <div className="space-y-4 mb-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 border rounded-xl shadow-sm flex justify-between items-start transition-all duration-200 ${addr.principal
                ? "border-[#EBC431] bg-[#413F39]/80"
                : "border-[#C0A648]/40 bg-[#333027] hover:bg-[#413F39]/60"
                }`}
            >
              <div>
                <p className="font-semibold text-lg">{addr.direccion}</p>
                <p className="text-sm text-[#F5F5F5]/70">
                  {addr.distrito}, {addr.provincia}, {addr.pais} — {addr.codigoPostal}
                </p>
                {addr.referencia && (
                  <p className="text-sm mt-1 italic text-[#F5F5F5]/70">Ref: {addr.referencia}</p>
                )}
                {addr.principal && (
                  <span className="text-xs bg-[#EBC431] text-[#333027] px-2 py-1 rounded-full mt-2 inline-block font-medium">
                    Dirección principal
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => openModal(addr)} className="text-sm text-[#EBC431] hover:underline">
                  Editar
                </button>
                <button onClick={() => deleteAddress(addr.id)} className="text-sm text-red-400 hover:underline">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-[#F5F5F5]/70 mb-6">No tienes direcciones registradas.</p>
      )}

      <button
        onClick={() => openModal()}
        className="bg-[#EBC431] text-[#333027] font-semibold px-6 py-3 rounded-lg hover:bg-[#C0A648] transition-all hover:scale-105"
      >
        + Agregar nueva dirección
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-[#2C2A25] p-8 rounded-2xl w-[90%] max-w-lg border border-[#C0A648]/40 shadow-2xl relative">
            <h3 className="text-2xl font-semibold text-[#EBC431] mb-6 text-center">
              {editingId ? "Editar dirección" : "Nueva dirección"}
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FIELDS.filter(
                  (f) => f.key !== "direccion" && f.key !== "referencia"
                ).map((f) => (
                  <div key={String(f.key)} className="flex flex-col">
                    <label className="text-sm text-[#F5F5F5]/70 mb-1 font-medium">
                      {f.placeholder.replace(" (opcional)", "")}
                    </label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="fancy-input"
                      value={String(newAddress[f.key] ?? "")}
                      onChange={(e) => setField(f.key, e.target.value as any)}
                    />
                  </div>
                ))}
              </div>

              {FIELDS.filter(
                (f) => f.key === "direccion" || f.key === "referencia"
              ).map((f) => (
                <div key={String(f.key)} className="flex flex-col">
                  <label className="text-sm text-[#F5F5F5]/70 mb-1 font-medium">
                    {f.placeholder.replace(" (opcional)", "")}
                  </label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="fancy-input w-full"
                    value={String(newAddress[f.key] ?? "")}
                    onChange={(e) => setField(f.key, e.target.value as any)}
                  />
                </div>
              ))}

              <label className="flex items-center gap-2 text-sm mt-2 text-[#F5F5F5]/80">
                <input
                  type="checkbox"
                  checked={!!newAddress.principal}
                  onChange={(e) =>
                    setNewAddress((prev) => ({ ...prev, principal: e.target.checked }))
                  }
                  className="accent-[#EBC431] w-4 h-4"
                />
                Establecer como dirección principal
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 bg-[#6B644C] rounded-lg text-[#F5F5F5] hover:bg-[#968751]/70 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-[#EBC431] text-[#333027] font-semibold rounded-lg hover:bg-[#C0A648] transition-all"
              >
                Guardar
              </button>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#EBC431]/70 hover:text-[#EBC431] text-xl"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
