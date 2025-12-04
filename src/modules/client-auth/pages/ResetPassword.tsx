import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { resetPassword, validateResetToken } from "../api/authApi";
import { FiLock, FiArrowLeft } from "react-icons/fi";

type Status = "validating" | "ready" | "expired" | "invalid" | "submitting" | "success" | "error";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("validating");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("Enlace inválido.");
      return;
    }

    const check = async () => {
      try {
        await validateResetToken(token);
        setStatus("ready");
      } catch (error: any) {
        const msg = error?.response?.data?.message || "";
        if (msg.toLowerCase().includes("expirado")) {
          setStatus("expired");
          setMessage("El enlace expiró, solicita uno nuevo.");
        } else {
          setStatus("invalid");
          setMessage("Enlace inválido.");
        }
      }
    };
    check();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !token) return;

    setStatus("submitting");
    setMessage("");
    try {
      await resetPassword({ token, nuevaContrasena: password });
      setStatus("success");
      setMessage("Contraseña actualizada. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.response?.data?.message || "No se pudo actualizar la contraseña.");
    }
  };

  const renderContent = () => {
    if (status === "validating") {
      return <p className="text-gray-600 text-sm">Validando enlace...</p>;
    }

    if (status === "invalid" || status === "expired") {
      return (
        <div className="space-y-3">
          <p className="text-sm text-red-600">{message || "Enlace no válido."}</p>
          <Link to="/forgot-password" className="text-sm text-[#EBC431] hover:text-[#d8b42c]">
            Solicitar un nuevo enlace
          </Link>
        </div>
      );
    }

    return (
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-2 focus:ring-[#EBC431] focus:border-[#EBC431] block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
              placeholder="Introduce una nueva contraseña"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#EBC431] hover:bg-[#d8b42c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EBC431] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Actualizando..." : "Actualizar contraseña"}
        </button>

        {message && (
          <div
            className={`text-sm ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    );
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Restablecer contraseña</h1>
            <p className="text-gray-600">Ingresa una nueva contraseña para tu cuenta.</p>
          </div>

          <div className="bg-white py-8 px-6 sm:px-10 rounded-xl shadow-sm border border-gray-100">
            {renderContent()}
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
            <h2 className="text-3xl font-bold text-white leading-tight">Protege tu cuenta</h2>
            <p className="text-white/90 leading-relaxed text-base">
              Crea una contraseña segura y única para mantener tu cuenta protegida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
