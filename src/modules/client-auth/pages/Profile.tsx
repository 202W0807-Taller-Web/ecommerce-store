import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiShoppingBag,
  FiHeart,
  FiLock,
} from "react-icons/fi";
const API_URL = `${import.meta.env.VITE_AUTH_BACKEND}`;

function EditProfileForm({ user, onClose }: any) {

  const { refreshUser } = useContext(AuthContext)!; ;

  const [formData, setFormData] = useState({
    nombres: user.nombres || "",
    apellido_p: user.apellido_p || "",
    apellido_m: user.apellido_m || "",
    celular: user.celular || "",
    f_nacimiento: user.f_nacimiento || "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/usuarios/${user.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        // actualizar AuthContext con la nueva info
        await refreshUser();
        onClose();
      } else {
        alert("Error al actualizar perfil");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="text-sm font-medium text-gray-700">Nombres</label>
        <input
          type="text"
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Apellido Paterno</label>
        <input
          type="text"
          name="apellido_p"
          value={formData.apellido_p}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Apellido Materno</label>
        <input
          type="text"
          name="apellido_m"
          value={formData.apellido_m}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Celular</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Fecha de nacimiento</label>
        <input
          type="date"
          name="f_nacimiento"
          value={formData.f_nacimiento || ""}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Guardar
        </button>
      </div>

    </form>
  );
}

export default function Profile() {
  const { user } = useContext(AuthContext)!;
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Perfil de Usuario</h2>
            <p className="mt-2 text-sm text-gray-500">Por favor inicia sesión para ver tu perfil</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto h-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestiona tu información personal, direcciones y preferencias
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-8 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <FiUser className="w-10 h-10 text-primary" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.nombres} {user.apellido_p} {user.apellido_m || ""}
                </h2>
                <p className="text-sm text-gray-500">
                  Miembro desde {formatDate(user.created_at || new Date().toISOString())}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiEdit2 className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
              Editar perfil
            </button>

          </div>

          <div className="border-t border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "orders"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Mis Pedidos
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "wishlist"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Lista de deseos
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {activeTab === "profile" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Información Personal</h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nombre completo</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.nombres} {user.apellido_p} {user.apellido_m || ""}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Correo electrónico</h4>
                  <div className="mt-1 flex items-center">
                    <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{user.correo}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Teléfono</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.celular || "Sin registrar"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fecha de nacimiento</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.f_nacimiento
                      ? formatDate(user.f_nacimiento)
                      : "Sin registrar"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Dirección Principal</h4>
                  <div className="mt-1 flex items-start">
                    <FiMapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-900">
                      {user.direccion ? user.direccion : "Sin registrar"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Seguridad</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark">
                    <FiLock className="mr-2 h-4 w-4" />
                    Cambiar contraseña
                  </button>
                  <Link
                    to="/privacy-settings"
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    <FiLock className="mr-2 h-4 w-4" />
                    Gestionar privacidad y consentimientos
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Mis Pedidos</h3>
              <div className="text-center py-12">
                <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos recientes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cuando realices un pedido, aparecerá aquí.
                </p>
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Lista de deseos</h3>
              <div className="text-center py-12">
                <FiHeart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tu lista de deseos está vacía</h3>
                <p className="mt-1 text-sm text-gray-500">Guarda tus productos favoritos aquí.</p>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
                <EditProfileForm
                  user={user}
                  onClose={() => setIsEditing(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>



  );

}
