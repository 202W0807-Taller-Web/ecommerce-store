import {
  CiUser,
  CiLocationOn,
  CiHeart,
  CiSettings,
  CiLogout,
  CiBoxes,
  CiLock,
} from "react-icons/ci";

type MenuItemProps = {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  isDanger?: boolean;
};

export const MenuItem = ({
  icon,
  label,
  isActive,
  isDanger = false,
  onClick,
  id,
}: MenuItemProps) => (
  <li>
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors cursor-pointer ${
        isDanger
          ? "text-red-600 hover:bg-red-50"
          : isActive
          ? "text-gray-700 bg-gray-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isDanger ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-600"
        } mr-3`}
      >
        {icon}
      </span>
      <span className="text-left flex-1">{label}</span>
    </button>
  </li>
);

type UserMenuProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userData: {
    name: string;
    email: string;
  };
};

export const UserMenu = ({
  activeTab,
  onTabChange,
  userData,
}: UserMenuProps) => {
  const menuItems = [
    { id: "profile", icon: <CiUser size={18} />, label: "Mi perfil" },
    { id: "orders", icon: <CiBoxes size={18} />, label: "Mis pedidos" },
    { id: "addresses", icon: <CiLocationOn size={18} />, label: "Direcciones" },
    { id: "wishlist", icon: <CiHeart size={18} />, label: "Lista de deseos" },
    { id: "security", icon: <CiLock size={18} />, label: "Seguridad" },
    { id: "settings", icon: <CiSettings size={18} />, label: "Configuración" },
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <CiUser size={18} className="text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {userData.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">{userData.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-1">
          <ul className="space-y-0.5">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                onClick={onTabChange}
              />
            ))}
            <MenuItem
              id="logout"
              icon={<CiLogout size={18} />}
              label="Cerrar sesión"
              isActive={false}
              isDanger
              onClick={() => console.log("Cerrar sesión")}
            />
          </ul>
        </nav>
      </div>
    </div>
  );
};
