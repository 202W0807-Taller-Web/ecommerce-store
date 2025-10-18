interface UserInfoProps {
  values: {
    nombreCompleto: string;
    email: string;
    telefono: string;
  };
  onChange: (values: {
    nombreCompleto: string;
    email: string;
    telefono: string;
  }) => void;
}

export default function UserInfo({ values, onChange }: UserInfoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  const [nombres, apellidos] = values.nombreCompleto.split(" ", 2);

  return (
    <div className="bg-[#413F39]/50 p-8 rounded-2xl shadow-lg text-[#F5F5F5] space-y-6">
      {/* Nombres y apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          className="fancy-input"
          value={nombres || ""}
          onChange={(e) =>
            onChange({ ...values, nombreCompleto: `${e.target.value} ${apellidos || ""}`.trim() })
          }
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          className="fancy-input"
          value={apellidos || ""}
          onChange={(e) =>
            onChange({ ...values, nombreCompleto: `${nombres || ""} ${e.target.value}`.trim() })
          }
        />
      </div>

      {/* Email y teléfono */}
      <div className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="fancy-input"
          value={values.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          className="fancy-input"
          value={values.telefono}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
