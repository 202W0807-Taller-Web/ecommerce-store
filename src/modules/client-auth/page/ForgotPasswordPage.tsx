import { useState } from "react";
import { forgotPassword } from "../api/auth";

const ForgotPasswordPage = () => {
  const [correo, setCorreo] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) return;
    setStatus("loading");
    setMessage("");
    try {
      await forgotPassword(correo);
      setStatus("sent");
      setMessage("Si el correo es válido, te enviamos un enlace de recuperación.");
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.response?.data?.message || "No se pudo procesar la solicitud.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-sm border border-gray-100 rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Recupera tu cuenta</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa tu correo y te enviaremos un enlace temporal para restablecer tu contraseña.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {status === "loading" ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        {message && (
          <div className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
