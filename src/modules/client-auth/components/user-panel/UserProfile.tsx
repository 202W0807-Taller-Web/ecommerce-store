import { useState, useEffect } from "react";
import { updateUser } from "../../api/users";
import { useAuth } from "../../hooks/useAuth";

type UserData = {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
};

type UserProfileProps = {
  userData: UserData;
  onUpdate: (data: Partial<UserData>) => void;
};

export const UserProfile = ({ userData, onUpdate }: UserProfileProps) => {
  const [formData, setFormData] = useState(userData);
  const { user } = useAuth(); // ⬅ Necesitamos el ID del usuario

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return alert("Error: usuario no autenticado");

    // Dividir el nombre completo
    const partes = formData.name.trim().split(" ");
    const nombres = partes.shift() || "";
    const apellido_p = partes.shift() || "";
    const apellido_m = partes.join(" ") || "";

    try {
      const updated = await updateUser(user.id, {
        nombres,
        apellido_p,
        apellido_m,
        correo: formData.email,
        celular: formData.phone,
      });

      // Actualiza el panel con los nuevos datos
      onUpdate({
        name: `${updated.nombres} ${updated.apellido_p} ${updated.apellido_m}`,
        email: updated.correo,
        phone: updated.celular ?? "",
      });

      alert("Datos actualizados correctamente");

    } catch (error: any) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al guardar cambios");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Información personal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miembro desde
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg">
                {formData.memberSince}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};