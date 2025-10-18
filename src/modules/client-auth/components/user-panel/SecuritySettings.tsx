import { useState, useEffect } from 'react';

type ConsentSettings = {
  marketingEmails: boolean;
  dataSharing: boolean;
  personalizedAds: boolean;
};

type SecuritySettingsProps = {
  onSave: (settings: ConsentSettings) => void;
};

export const SecuritySettings = ({ onSave }: SecuritySettingsProps) => {
  const [settings, setSettings] = useState<ConsentSettings>({
    marketingEmails: false,
    dataSharing: false,
    personalizedAds: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('privacySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (setting: keyof ConsentSettings) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting],
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const saveSettings = async (newSettings: ConsentSettings) => {
    setIsLoading(true);
    setSaveStatus('Guardando...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem('privacySettings', JSON.stringify(newSettings));
      onSave(newSettings);
      setSaveStatus('¡Preferencias guardadas!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('Error al guardar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadData = () => {
    if (window.confirm('¿Estás seguro de que deseas descargar tus datos personales?')) {
      const userData = {
        nombre: 'Usuario Ejemplo', // Replace with actual user data
        email: 'usuario@ejemplo.com',
        preferencias: settings,
        fechaDescarga: new Date().toISOString(),
      };

      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(userData, null, 2)
      )}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'mis-datos-personales.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Preferencias de privacidad
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Controla cómo utilizamos tu información personal.
          </p>
        </div>

        <div className="p-4 space-y-6">
          {/* Email Marketing Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Correos de marketing
              </h3>
              <p className="text-sm text-gray-500">
                Recibir ofertas y novedades por correo electrónico.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
                disabled={isLoading}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Data Sharing Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Compartir datos con terceros
              </h3>
              <p className="text-sm text-gray-500">
                Permitir compartir mis datos con socios de confianza.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.dataSharing}
                onChange={() => handleToggle('dataSharing')}
                disabled={isLoading}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Personalized Ads Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Publicidad personalizada
              </h3>
              <p className="text-sm text-gray-500">
                Mostrar anuncios basados en mis intereses.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.personalizedAds}
                onChange={() => handleToggle('personalizedAds')}
                disabled={isLoading}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {saveStatus && (
            <div className="text-sm text-green-600 mt-2">
              {saveStatus}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Tus datos personales
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona la información que tenemos sobre ti.
          </p>
        </div>
        <div className="p-4">
          <button
            onClick={handleDownloadData}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Descargar mis datos
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Descarga un archivo con todos tus datos personales en formato JSON.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            Política de privacidad
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Al utilizar nuestros servicios, aceptas nuestras políticas de privacidad y el
            procesamiento de tus datos personales de acuerdo con la Ley de Protección de
            Datos Personales (Ley N° 29733) y el Reglamento General de Protección de
            Datos (RGPD) de la Unión Europea.
          </p>
          <a
            href="/politica-de-privacidad"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Leer la política de privacidad completa
          </a>
        </div>
      </div>
    </div>
  );
};
