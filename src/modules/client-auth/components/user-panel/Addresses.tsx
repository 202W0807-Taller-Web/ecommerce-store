import React, { useState, useEffect } from "react";

type Address = {
  id: number;
  calle: string;
  ciudad: string;
  estado?: string;
  pais: string;
  codigo_postal?: string;
  isDefault: boolean;
};


type AddressesProps = {
  addresses: Address[];
  onAddAddress: (address: Omit<Address, "id" | "isDefault">) => void;
  onUpdateAddress: (id: number, address: Partial<Address>) => void;
  onDeleteAddress: (id: number) => void;
  onSetDefault: (id: number) => void;
};

export const Addresses = ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
}: AddressesProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Address, "id" | "isDefault">>({
    calle: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    pais: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateAddress(editingId, formData);
      setEditingId(null);
    } else {
      onAddAddress(formData);
    }
    setFormData({
      calle: "",
      ciudad: "",
      estado: "",
      codigo_postal: "",
      pais: "",
    });
    setIsAdding(false);
  };

  const handleEdit = (address: Address) => {
    const { id, ...rest } = address;
    setFormData(rest);
    setEditingId(id);
    setOpenMenuId(null);
    setIsAdding(true);
  };

  const toggleMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu when clicking outside
  const handleClickOutside = () => {
    setOpenMenuId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      calle: "",
      ciudad: "",
      estado: "",
      codigo_postal: "",
      pais: "",
    });
  };

  // Add click outside effect
  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6" onClick={handleClickOutside}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Mis Direcciones
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Agregar dirección
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800">
              {editingId ? "Editar dirección" : "Nueva dirección"}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-500 sm:hidden"
              aria-label="Cerrar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="calle"
                  value={formData.calle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Calle y número"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Ej: Lima"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento *
                </label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Ej: Lima"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal *
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Ej: 15001"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}   
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm sm:text-base"
                    placeholder="Ej: Perú"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {editingId ? "Actualizar" : "Guardar"} dirección
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !isAdding ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay direcciones guardadas
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando tu primera dirección de envío.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Agregar dirección
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 sm:p-5 border rounded-lg transition-all ${address.isDefault
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
                }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      {address.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                          <svg
                            className="-ml-0.5 mr-1.5 h-2 w-2 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx={4} cy={4} r={3} />
                          </svg>
                          Predeterminada
                        </span>
                      )}
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        {address.calle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {address.ciudad}, {address.estado}
                      </p>
                      <p className="text-sm text-gray-600">{address.codigo_postal}</p>
                      <p className="text-sm text-gray-600">{address.pais}</p>
                    </div>

                    <div className="ml-2 flex-shrink-0">
                      <div className="relative">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(address.id, e);
                          }}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>

                        {!address.isDefault && openMenuId === address.id && (
                          <div
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => onSetDefault(address.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Establecer como predeterminada
                              </button>
                              <button
                                onClick={() => onDeleteAddress(address.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Eliminar dirección
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>
                  {!address.isDefault && (
                    <>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => onDeleteAddress(address.id)}
                        className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 max-w-[100px] overflow-hidden"
                      >
                        <svg
                          className="h-4 w-4 mr-1 shrink-0 flex-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="block truncate overflow-hidden whitespace-nowrap min-w-0 flex-1">
                          Eliminar
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
