import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiShield, FiDownload, FiSettings } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import {
  getPreferences,
  updatePreferences,
  listConsents,
  getUserConsents,
  updateUserConsents,
  exportUserData,
} from "../api/privacyApi";

type Preferencias = {
  notificaciones_on: boolean;
  marketing_emails: boolean;
  privacidad_nivel?: string | null;
  tema?: string | null;
  idioma?: string | null;
};

type Consentimiento = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  aceptado?: boolean;
};

const PrivacySettings = () => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;

  const [prefs, setPrefs] = useState<Preferencias>({
    notificaciones_on: true,
    marketing_emails: false,
    privacidad_nivel: "medio",
    tema: null,
    idioma: "es",
  });
  const [consents, setConsents] = useState<Consentimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [consentMsg, setConsentMsg] = useState<string | null>(null);

  const isReady = useMemo(() => Boolean(userId), [userId]);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const [prefRes, allConsents, userConsents] = await Promise.all([
          getPreferences(userId).catch(() => null),
          listConsents().catch(() => []),
          getUserConsents(userId).catch(() => []),
        ]);

        if (prefRes) {
          setPrefs({
            notificaciones_on: prefRes.notificaciones_on ?? true,
            marketing_emails: prefRes.marketing_emails ?? false,
            privacidad_nivel: prefRes.privacidad_nivel ?? "medio",
            tema: prefRes.tema ?? null,
            idioma: prefRes.idioma ?? "es",
          });
        }

        const aceptados = new Map<number, boolean>();
        (userConsents || []).forEach((c: any) => {
          aceptados.set(c.consentimiento_id, Boolean(c.aceptado));
        });

        const consentsWithState = (allConsents || []).map((c: any) => ({
          id: c.id,
          nombre: c.nombre,
          descripcion: c.descripcion,
          aceptado: aceptados.get(c.id) ?? false,
        }));

        setConsents(consentsWithState);
      } catch (error) {
        console.error("Error cargando privacidad:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const handlePrefToggle = async (key: keyof Preferencias, value?: boolean) => {
    if (!userId) return;
    const next = { ...prefs, [key]: value ?? !prefs[key] };
    setPrefs(next);
    setStatusMsg("Guardando preferencias...");
    try {
      await updatePreferences(userId, next);
      setStatusMsg("Preferencias guardadas");
      setTimeout(() => setStatusMsg(null), 2000);
    } catch (error) {
      console.error("Error guardando preferencias:", error);
      setStatusMsg("No se pudo guardar");
    }
  };

  const handleConsentToggle = async (id: number) => {
    if (!userId) return;
    const nextConsents = consents.map((c) =>
      c.id === id ? { ...c, aceptado: !c.aceptado } : c
    );
    setConsents(nextConsents);
    setConsentMsg("Guardando consentimientos...");
    try {
      const payload = nextConsents.map((c) => ({
        consentimiento_id: c.id,
        aceptado: Boolean(c.aceptado),
      }));
      await updateUserConsents(userId, payload);
      setConsentMsg("Consentimientos actualizados");
      setTimeout(() => setConsentMsg(null), 2000);
    } catch (error) {
      console.error("Error guardando consentimientos:", error);
      setConsentMsg("No se pudo guardar");
    }
  };

  const handleDownloadData = async () => {
    if (!userId) return;
    try {
      const data = await exportUserData(userId);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `datos-usuario-${userId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("No se pudo exportar datos:", error);
      alert("No se pudo exportar los datos");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiShield className="text-primary" />
              Privacidad y consentimientos
            </h1>
            <p className="text-sm text-gray-500">
              Gestiona tus preferencias de marketing y uso de datos.
            </p>
          </div>
          <Link
            to="/politica-de-privacidad"
            className="text-sm text-primary hover:text-primary-dark inline-flex items-center gap-1"
          >
            <FiSettings className="h-4 w-4" />
            Ver política de privacidad
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Preferencias de privacidad</h2>
            <p className="text-sm text-gray-500">
              Controla cómo usamos tu información personal.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
                <p className="text-sm text-gray-500">Recibir comunicaciones generales.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={prefs.notificaciones_on}
                  onChange={() => handlePrefToggle("notificaciones_on")}
                  disabled={loading}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EBC431]"></div>
              </label>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Correos de marketing</h3>
                <p className="text-sm text-gray-500">Ofertas y novedades por correo.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={prefs.marketing_emails}
                  onChange={() => handlePrefToggle("marketing_emails")}
                  disabled={loading}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EBC431]"></div>
              </label>
            </div>
          </div>

          {statusMsg && (
            <div className="px-6 py-3 text-sm text-primary">{statusMsg}</div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Consentimientos</h2>
            <p className="text-sm text-gray-500">Gestiona tus consentimientos activos.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {consents.length === 0 ? (
              <div className="px-6 py-4 text-sm text-gray-500">
                No hay consentimientos configurados.
              </div>
            ) : (
              consents.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{c.nombre}</h3>
                    {c.descripcion && (
                      <p className="text-sm text-gray-500">{c.descripcion}</p>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={Boolean(c.aceptado)}
                      onChange={() => handleConsentToggle(c.id)}
                      disabled={loading}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EBC431]"></div>
                  </label>
                </div>
              ))
            )}
          </div>
          {consentMsg && (
            <div className="px-6 py-3 text-sm text-primary">{consentMsg}</div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Tus datos personales</h2>
            <p className="text-sm text-gray-500">
              Descarga un archivo con la información asociada a tu cuenta.
            </p>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Exportar datos (JSON)</p>
              <p className="text-xs text-gray-500">
                Se generará un archivo con tu información.
              </p>
            </div>
            <button
              onClick={handleDownloadData}
              className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={!isReady}
            >
              <FiDownload className="mr-2" />
              Descargar datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
