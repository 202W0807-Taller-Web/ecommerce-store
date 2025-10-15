export default function UserInfo() {
  return (
    <div className="bg-[#413F39]/50 p-8 rounded-2xl shadow-lg text-[#F5F5F5] space-y-6">
      {/* Nombres y apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Nombres" className="fancy-input" />
        <input type="text" placeholder="Apellidos" className="fancy-input" />
      </div>

      {/* Email y teléfono */}
      <div className="space-y-4">
        <input type="email" placeholder="Correo electrónico" className="fancy-input" />
        <input type="tel" placeholder="Teléfono" className="fancy-input" />
      </div>
    </div>
  );
}
