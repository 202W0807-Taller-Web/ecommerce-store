import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as authApi from "../api/authApi";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiCalendar,
} from "react-icons/fi";
const API_URL = `${import.meta.env.VITE_AUTH_BACKEND}`;


function EditProfileForm({ user, onClose, onSuccess }: any) {

  const { refreshUser } = useContext(AuthContext)!;;

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    return dateString.split("T")[0];  // Extrae solo YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    nombres: user.nombres || "",
    apellido_p: user.apellido_p || "",
    apellido_m: user.apellido_m || "",
    celular: user.celular || "",
    correo: user.correo || "",
    f_nacimiento: formatDateForInput(user.f_nacimiento),
  });

  const [dateError, setDateError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "celular") {
      // Allow only digits
      const digits = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: digits });
      if (digits && digits.length !== 9) {
        setPhoneError("El teléfono debe tener 9 dígitos");
      } else {
        setPhoneError("");
      }
      return;
    }

    if (name === "f_nacimiento") {
      setFormData({ ...formData, [name]: value });
      const year = value ? value.split("-")[0] : "";
      if (year && year.length !== 4) {
        setDateError("El año debe tener 4 cifras");
      } else {
        setDateError("");
      }
      return;
    }

    if (name === "correo") {
      setFormData({ ...formData, [name]: value });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        setEmailError("El correo es requerido");
      } else if (!emailRegex.test(value)) {
        setEmailError("Correo inválido");
      } else {
        setEmailError("");
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Final validations
    if (!formData.correo) {
      setEmailError("El correo es requerido");
      return;
    }
    if (phoneError || dateError || emailError) {
      return;
    }

    if (formData.celular && formData.celular.length !== 9) {
      setPhoneError("El teléfono debe tener 9 dígitos");
      return;
    }

    if (formData.f_nacimiento) {
      const year = formData.f_nacimiento.split("-")[0];
      if (!year || year.length !== 4) {
        setDateError("El año debe tener 4 cifras");
        return;
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/usuarios/${user.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(data.message || "Error al actualizar perfil");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el servidor");
    }
  };

  const hasErrors = Boolean(phoneError || dateError || emailError);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-auto pr-2">

      <div className="sm:col-span-1">
        <label className="text-sm font-medium text-gray-700">Nombres</label>
        <input
          type="text"
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="text-sm font-medium text-gray-700">Apellido Paterno</label>
        <input
          type="text"
          name="apellido_p"
          value={formData.apellido_p}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="text-sm font-medium text-gray-700">Apellido Materno</label>
        <input
          type="text"
          name="apellido_m"
          value={formData.apellido_m}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
      </div>

      <div className="sm:col-span-1">
        <label className="text-sm font-medium text-gray-700">Celular</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
        {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
      </div>

      <div className="sm:col-span-1">
        <label className="text-sm font-medium text-gray-700">Fecha de nacimiento</label>
        <input
          type="date"
          name="f_nacimiento"
          value={formData.f_nacimiento || ""}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
        {dateError && <p className="text-xs text-red-500 mt-1">{dateError}</p>}
      </div>

      <div className="sm:col-span-2 flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 transform hover:-translate-y-0.5 transition duration-150 cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={hasErrors}
          className={`px-4 py-2 text-sm rounded-md text-white ${hasErrors ? 'bg-gray-400 opacity-60 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark cursor-pointer'} transform ${hasErrors ? '' : 'hover:-translate-y-0.5 hover:shadow-md'} transition duration-150`}
        >
          Guardar
        </button>
      </div>

    </form>
  );
}

export default function Profile() {
  const { user, refreshUser } = useContext(AuthContext)!;
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStartTime, setUploadStartTime] = useState<number>(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!user) {
        setImageError("Debes iniciar sesión para cambiar la imagen");
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setImageError("La imagen debe ser de 2MB o menos");
        return;
      }
      setSelectedImage(file);
      // Crear preview temporal y subir
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageError("");
      void uploadAvatar(file);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    setUploadStartTime(Date.now());
    if (!user) {
      setImageError("Usuario no disponible");
      setUploading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const data = await authApi.updateUser(user.id, formData);

      // Backend returns formatted user or success flag; treat presence of 'error' as failure
      if (data && !data.error) {
        try {
          await refreshUser();
        } catch (err) {
          console.warn("refreshUser failed:", err);
        }
        setSelectedImage(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setImageError("");
      } else {
        setImageError((data && (data.message || data.error)) || "Error al subir la imagen");
      }
    } catch (error) {
      console.error(error);
      setImageError("Ocurrió un error al subir la imagen");
    } finally {
      // Enforce minimum 2 seconds display time
      const elapsed = Date.now() - uploadStartTime;
      const remaining = Math.max(0, 2000 - elapsed);
      setTimeout(() => {
        setUploading(false);
      }, remaining);
    }
  };

  // Este efecto se asegura de que se actualice el estado de loading después de que se cargue el usuario
  useEffect(() => {
    if (user) {
      setLoading(false); // Desactivar la carga cuando los datos del usuario estén disponibles
      console.log('Datos del usuario:', user);  // Verifica los datos del usuario en Profile.tsx
    }
  }, [user]); // Se ejecuta cuando 'user' cambia (cuando es cargado)

  // Auto-dismiss success toast after 3 seconds
  useEffect(() => {
    if (showSuccessToast) {
      // match the CSS animation duration (3.5s) so fade-out is visible
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  // Addresses state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<any>(null); // null = new
  const [addressError, setAddressError] = useState<string>("");

  const loadAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const res = await fetch(`${API_URL}/api/direcciones/usuario/${user.id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data || []);
      } else {
        console.warn('Error loading addresses', data);
      }
    } catch (err) {
      console.error('Error fetching addresses', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'addresses' && user) {
      void loadAddresses();
    }
  }, [activeTab, user]);

  const openAddressModal = (addr: any | null) => {
    if (addr) {
      setAddressForm({ ...addr });
    } else {
      setAddressForm({ calle: '', ciudad: '', estado: '', pais: '', codigo_postal: '', isDefault: false });
    }
    setAddressError('');
    setAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setAddressModalOpen(false);
    setAddressForm(null);
    setAddressError('');
  };

  const handleAddressChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({ ...addressForm, [name]: type === 'checkbox' ? checked : value });
  };

  const saveAddress = async () => {
    if (!addressForm) return;
    if (!user) {
      setAddressError('Usuario no disponible');
      return;
    }
    // basic validation
    if (!addressForm.calle || !addressForm.ciudad || !addressForm.pais) {
      setAddressError('Los campos calle, ciudad y país son obligatorios');
      return;
    }
    try {
      const method = addressForm.id ? 'PUT' : 'POST';
      const url = addressForm.id ? `${API_URL}/api/direcciones/${addressForm.id}` : `${API_URL}/api/direcciones`;
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addressForm, usuario_id: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        await loadAddresses();
        setShowSuccessToast(true);
        closeAddressModal();
      } else {
        setAddressError(data?.error || data?.message || 'Error al guardar la dirección');
      }
    } catch (err) {
      console.error(err);
      setAddressError('Error al guardar la dirección');
    }
  };

  const deleteAddress = async (id: number) => {
    if (!confirm('¿Eliminar esta dirección?')) return;
    try {
      const res = await fetch(`${API_URL}/api/direcciones/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        await loadAddresses();
        setShowSuccessToast(true);
      } else {
        alert(data?.error || 'Error al eliminar');
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la dirección');
    }
  };

  const setDefaultAddress = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/direcciones/${id}/set-default`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        await loadAddresses();
        setShowSuccessToast(true);
      } else {
        alert(data?.error || 'Error al establecer predeterminada');
      }
    } catch (err) {
      console.error(err);
      alert('Error al establecer dirección predeterminada');
    }
  };


  if (loading) {
    return <div className="text-center py-12">Cargando...</div>; // O un spinner de carga
  }

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

  // Formatear la URL de la imagen de perfil si se ha seleccionado una nueva imagen
  const imageToDisplay = previewUrl || user.avatar_url;

  console.log("Avatar URL:", user.avatar_url);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("T")[0].split("-");

    return `${Number(day)} de ${new Intl.DateTimeFormat("es-ES", { month: "long" }).format(new Date(Number(year), Number(month) - 1, Number(day)))} de ${year}`;
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
              <div className="relative w-24 h-24 rounded-full overflow-hidden border group">
                {/* Mostrar la imagen de perfil */}
                <img
                  src={imageToDisplay || ""}
                  alt="Avatar"
                  className="w-full h-full object-cover transition-shadow duration-200 group-hover:shadow-lg"
                /*onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/path/to/default-avatar.png'; // Imagen por defecto en caso de error
                }}*/
                />
                {/* Efecto y mensaje al pasar el cursor */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-center"
                >
                  Cambiar imagen
                </label>
                {/* Loader overlay during upload */}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </div>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {/* Estado de subida y errores visuales se muestran fuera del contenedor */}
              </div>
              {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}


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
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 cursor-pointer"
            >
              <FiEdit2 className="-ml-1 mr-2 h-4 w-4" />
              Editar perfil
            </button>

          </div>

          <div className="border-t border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm cursor-pointer ${activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm cursor-pointer ${activeTab === "orders"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Mis Pedidos
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm cursor-pointer ${activeTab === "wishlist"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Lista de deseos
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm cursor-pointer ${activeTab === "addresses"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Direcciones
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
                  <div className="mt-1 flex items-center">
                    <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{user.nombres} {user.apellido_p} {user.apellido_m || ""}</p>
                  </div>
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
                  <div className="mt-1 flex items-center">
                    <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{user.celular || "Sin registrar"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fecha de nacimiento</h4>
                  <div className="mt-1 flex items-center">
                    <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{user.f_nacimiento ? formatDate(user.f_nacimiento) : "Sin registrar"}</p>
                  </div>
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

          {activeTab === "addresses" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Mis Direcciones</h3>
                <button
                  onClick={() => openAddressModal(null)}
                  disabled={addresses.length >= 3}
                  title={addresses.length >= 3 ? "Solo se permite añadir 3 direcciones como máximo" : ""}
                  className={`inline-flex items-center px-3 py-2 border rounded-md text-sm transition transform ${addresses.length >= 3 ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 hover:bg-primary hover:text-white hover:border-primary cursor-pointer hover:-translate-y-0.5 hover:shadow-md'}`}
                >
                  Agregar dirección
                </button>
              </div>

              {loadingAddresses ? (
                <div className="text-center py-12">
                  <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sin direcciones registradas</h3>
                  <p className="mt-1 text-sm text-gray-500">Agrega una dirección para tus pedidos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((d) => (
                    <div key={d.id} className="bg-white p-4 rounded-md shadow-md border flex flex-col justify-between">
                      <div>
                        <div className="flex items-start">
                          <FiMapPin className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">{d.calle}</p>
                            <p className="text-sm text-gray-600">{d.ciudad}{d.estado ? `, ${d.estado}` : ''} - {d.pais}</p>
                            {d.codigo_postal && <p className="text-sm text-gray-500">{d.codigo_postal}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          {d.isDefault && <span className="text-xs bg-primary text-white px-2 py-1 rounded">Predeterminada</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openAddressModal(d)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition transform hover:-translate-y-0.5 hover:shadow cursor-pointer">Editar</button>
                          <button onClick={() => deleteAddress(d.id)} className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50 hover:border-red-300 transition transform hover:-translate-y-0.5 hover:shadow cursor-pointer">Eliminar</button>
                          {!d.isDefault && (
                            <button onClick={() => setDefaultAddress(d.id)} className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark transition transform hover:-translate-y-0.5 hover:shadow cursor-pointer">Usar</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address modal */}
              {addressModalOpen && (
                <>
                  <style>{`@keyframes fadeScale { from { opacity: 0; transform: translateY(-8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full" style={{ animation: 'fadeScale 260ms ease-out' }}>
                      <h3 className="text-lg font-medium mb-4">{addressForm?.id ? 'Editar dirección' : 'Agregar dirección'}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <label className="text-sm">Calle*</label>
                        <input name="calle" value={addressForm?.calle || ''} onChange={handleAddressChange} className="w-full border rounded px-3 py-2" />

                        <label className="text-sm">Ciudad*</label>
                        <input name="ciudad" value={addressForm?.ciudad || ''} onChange={handleAddressChange} className="w-full border rounded px-3 py-2" />

                        <label className="text-sm">Estado</label>
                        <input name="estado" value={addressForm?.estado || ''} onChange={handleAddressChange} className="w-full border rounded px-3 py-2" />

                        <label className="text-sm">País*</label>
                        <input name="pais" value={addressForm?.pais || ''} onChange={handleAddressChange} className="w-full border rounded px-3 py-2" />

                        <label className="text-sm">Código postal</label>
                        <input name="codigo_postal" value={addressForm?.codigo_postal || ''} onChange={handleAddressChange} className="w-full border rounded px-3 py-2" />

                        <label className="inline-flex items-center mt-2">
                          <input type="checkbox" name="isDefault" checked={!!addressForm?.isDefault} onChange={handleAddressChange} className="mr-2" />
                          Marcar como predeterminada
                        </label>

                        {addressError && <p className="text-xs text-red-500">{addressError}</p>}

                        <div className="flex justify-end gap-3 mt-4">
                          <button onClick={closeAddressModal} className="px-4 py-2 border rounded bg-white hover:bg-gray-100 transition transform hover:-translate-y-0.5 hover:shadow cursor-pointer">Cancelar</button>
                          <button onClick={saveAddress} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition transform hover:-translate-y-0.5 hover:shadow cursor-pointer">Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {isEditing && (
            <>
              <style>{`@keyframes fadeScale { from { opacity: 0; transform: translateY(-8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes fadeInOut { 0% { opacity: 0; transform: translateY(10px); } 30% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(10px); } }`}</style>
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto" style={{ animation: 'fadeScale 260ms ease-out' }}>
                  <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
                  <EditProfileForm
                    user={user}
                    onClose={() => setIsEditing(false)}
                    onSuccess={() => setShowSuccessToast(true)}
                  />
                </div>
              </div>
            </>
          )}

          {showSuccessToast && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50" style={{ animation: 'fadeInOut 3.5s ease-in-out forwards' }}>
              <p className="text-sm font-medium">Cambios guardados correctamente</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );

}
