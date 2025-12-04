import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) return;

    setStatus("loading");
    setMessage("");
    try {
      const res = await forgotPassword(correo);
      // El backend siempre responde 200 con mensaje genérico
      setStatus("sent");
      setMessage(res?.message || "Si el correo es válido, te enviaremos un enlace de recuperación.");
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error?.response?.data?.message ||
          "No se pudo procesar la solicitud - Correo Inexistente. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:px-24 lg:py-20 relative">
        <Link
          to="/login"
          className="absolute top-6 left-6 md:top-8 md:left-12 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          aria-label="Volver"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recupera tu cuenta</h1>
            <p className="text-gray-600">
              Ingresa tu correo y te enviaremos un enlace temporal para restablecer tu contraseña.
            </p>
          </div>

          <div className="bg-white py-8 px-6 sm:px-10 rounded-xl shadow-sm border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="focus:ring-2 focus:ring-[#EBC431] focus:border-[#EBC431] block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#EBC431] hover:bg-[#d8b42c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EBC431] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>

            {message && (
              <div
                className={`mt-4 text-sm ${
                  status === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/src/assets/buy-online-ecommerce-parcel-box-s27djx84qkdna93g.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-[#EBC431] bg-opacity-90 mix-blend-multiply"></div>
        </div>
        <div className="relative w-full h-full flex items-center justify-center p-8 z-10">
          <div className="max-w-xs mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-white leading-tight">¿Necesitas ayuda?</h2>
            <p className="text-white/90 leading-relaxed text-base">
              Restablece tu contraseña con el enlace temporal que te enviaremos al correo registrado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
