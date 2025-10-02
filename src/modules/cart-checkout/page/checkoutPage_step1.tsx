import { Link } from "react-router-dom";

export default function Checkout_Step1() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Selecciona tu método de envío
      </h1>

      <div className="space-y-6">
        {/* Envío Estándar */}
        <button className="w-full p-6 text-left border rounded-xl shadow hover:shadow-md hover:border-yellow-600 transition">
          <h2 className="text-xl font-semibold">Envío Estándar (3–5 días)</h2>
          <p className="text-gray-600 mt-2">$9.99</p>
        </button>

        {/* Envío Express */}
        <button className="w-full p-6 text-left border rounded-xl shadow hover:shadow-md hover:border-yellow-600 transition">
          <h2 className="text-xl font-semibold">Envío Express (1–2 días)</h2>
          <p className="text-gray-600 mt-2">$19.99</p>
        </button>

        {/* Recojo en tienda */}
        <button className="w-full p-6 text-left border rounded-xl shadow hover:shadow-md hover:border-yellow-600 transition">
          <h2 className="text-xl font-semibold">Recojo en tienda</h2>
          <p className="text-gray-600 mt-2">GRATIS - Disponible en 2 días</p>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Link
          to="/cart"
          className="px-6 py-3 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          ← Volver al carrito
        </Link>
        <Link
          to="/checkout/step2"
          className="px-6 py-3 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition"
        >
          Siguiente paso →
        </Link>
      </div>
    </div>
  );
}
