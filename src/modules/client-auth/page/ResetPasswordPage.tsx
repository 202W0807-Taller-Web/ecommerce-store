import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword, validateResetToken } from "../api/auth";

type ResetStatus = "validating" | "invalid" | "expired" | "ready" | "submitting" | "success" | "error";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<ResetStatus>("validating");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("Enlace inválido.");
      return;
    }

    const validate = async () => {
      try {
        await validateResetToken(token);
        setStatus("ready");
      } catch (error: any) {
        const respMsg = error?.response?.data?.message || "";
        if (respMsg.toLowerCase().includes("expirado")) {
          setStatus("expired");
          setMessage("El enlace expiró, solicita uno nuevo.");
        } else {
          setStatus("invalid");
          setMessage("Enlace inválido.");
        }
      }
    };

    validate();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !token) return;
    setStatus("submitting");
    setMessage("");
    try {
      await resetPassword({ token, nuevaContrasena: password });
      setStatus("success");
      setMessage("Contraseña actualizada. Ya puedes iniciar sesión.");
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
          <Link to="/auth/forgot" className="text-sm text-blue-600 hover:text-blue-700">
            Solicitar un nuevo enlace
          </Link>
        </div>
      );
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Introduce una nueva contraseña"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {status === "submitting" ? "Actualizando..." : "Actualizar contraseña"}
        </button>

        {message && (
          <div className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}
      </form>
    );
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-sm border border-gray-100 rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Restablecer contraseña</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa una nueva contraseña para tu cuenta.
        </p>

        {renderContent()}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
