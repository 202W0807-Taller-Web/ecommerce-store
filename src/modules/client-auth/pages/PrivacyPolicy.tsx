export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-semibold mb-6">Política de Privacidad</h1>

      <p className="mb-4">
        En <strong>EzCommerce</strong> tratamos los datos personales conforme a la
        <strong> Ley de Protección de Datos Personales del Perú (Ley N.º 29733)</strong> y al
        <strong> Reglamento General de Protección de Datos de la Unión Europea (RGPD)</strong>.
        Esta página resume los principios y obligaciones que observamos bajo ambos marcos.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Marcos normativos que seguimos</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Perú – Ley N.º 29733</strong>: principios de legalidad, consentimiento, finalidad,
          proporcionalidad, seguridad, calidad y derechos ARCO (acceso, rectificación, cancelación, oposición).
        </li>
        <li>
          <strong>Unión Europea – RGPD</strong>: licitud, transparencia, minimización de datos, limitación del
          plazo de conservación, integridad y confidencialidad; derechos de acceso, rectificación, supresión,
          limitación, portabilidad y oposición.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Principios que aplicamos</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Licitud, lealtad y transparencia</strong> en el tratamiento.</li>
        <li><strong>Finalidad determinada</strong> y compatible con el servicio.</li>
        <li><strong>Minimización y proporcionalidad</strong>: recolectamos lo necesario.</li>
        <li><strong>Exactitud y actualización</strong> razonable de la información.</li>
        <li><strong>Limitación del plazo de conservación</strong> según finalidad o ley.</li>
        <li><strong>Seguridad y confidencialidad</strong> con medidas técnicas y organizativas.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Derechos de las personas usuarias</h2>
      <p className="mb-2">
        Habilitamos el ejercicio de derechos ARCO y los derechos del RGPD: acceso, rectificación, cancelación/supresión,
        oposición, limitación del tratamiento y portabilidad.
      </p>
      <p className="mb-2">
        Para consultas o solicitudes, contáctanos en{" "}
        <a href="mailto:privacidad@ezcommerce.com" className="text-primary hover:text-primary-dark">
          privacidad@ezcommerce.com
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Transferencias y encargados</h2>
      <p>
        Podemos apoyarnos en proveedores como encargados de tratamiento bajo contratos con cláusulas de
        confidencialidad y seguridad. Si hay transferencias internacionales, se aplicarán salvaguardas adecuadas.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Autoridades de control</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Perú</strong>: Autoridad Nacional de Protección de Datos Personales (ANPD).</li>
        <li><strong>UE</strong>: Autoridades de cada Estado miembro y el Comité Europeo de Protección de Datos.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Texto legal completo</h2>
      <p className="mb-4">Consulta las normas íntegras en los siguientes enlaces oficiales:</p>

      <div className="grid sm:grid-cols-2 gap-3">
        <a
          href="https://cdn.www.gob.pe/uploads/document/file/272360/Ley%20N%C2%BA%2029733.pdf.pdf?v=1618338779"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50 transition"
        >
          Ley N.º 29733 (PDF oficial)
        </a>
        <a
          href="https://www.boe.es/doue/2016/119/L00001-00088.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50 transition"
        >
          RGPD (DOUE – PDF oficial)
        </a>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Última actualización: {new Date().toLocaleDateString("es-PE")}
      </p>
    </div>
  );
}
