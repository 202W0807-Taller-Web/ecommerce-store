import { useState } from "react";
import {
  UserMenu,
  UserProfile,
  OrderHistory,
  Addresses,
  SecuritySettings,
} from "../components/user-panel";

type UserData = {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
};

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  status: "Pendiente" | "En proceso" | "Enviado" | "Entregado" | "Cancelado";
  total: number;
  items: OrderItem[];
};

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<UserData>({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+51 987 654 321",
    memberSince: "Enero 2024",
  });

  // Mock data for orders
  const recentOrders: Order[] = [
    {
      id: "#ORD-001",
      date: "15 Oct 2025",
      status: "Enviado",
      total: 249.9,
      items: [
        { name: "Zapatillas Deportivas", quantity: 1, price: 199.9, image: "" },
        { name: "Medias Deportivas", quantity: 2, price: 25, image: "" },
      ],
    },
    {
      id: "#ORD-002",
      date: "10 Oct 2025",
      status: "Entregado",
      total: 149.9,
      items: [
        { name: "Camiseta Deportiva", quantity: 2, price: 74.95, image: "" },
      ],
    },
    {
      id: "#ORD-003",
      date: "05 Oct 2025",
      status: "En proceso",
      total: 99.9,
      items: [
        { name: "Gorra Deportiva", quantity: 1, price: 49.95, image: "" },
        { name: "Lentes Deportivos", quantity: 1, price: 50, image: "" },
      ],
    },
  ];

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      street: "Av. Arequipa 1234",
      city: "Lima",
      state: "Lima",
      zipCode: "15001",
      country: "Perú",
      isDefault: true,
    },
    {
      id: "2",
      street: "Calle Los Pinos 456",
      city: "Arequipa",
      state: "Arequipa",
      zipCode: "04001",
      country: "Perú",
      isDefault: false,
    },
  ]);

  const handleUpdateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...newData }));
    // Here you would typically make an API call to update the user data
    console.log("Updating user data:", newData);
  };

  const handleViewOrderDetails = (orderId: string) => {
    console.log("Viewing order details:", orderId);
    // Navigate to order details or show a modal
  };

  const handleTrackOrder = (orderId: string) => {
    console.log("Tracking order:", orderId);
    // Navigate to tracking page or show tracking info
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <UserProfile userData={userData} onUpdate={handleUpdateUserData} />
        );

      case "orders":
        return (
          <OrderHistory
            orders={recentOrders}
            onViewDetails={handleViewOrderDetails}
            onTrackOrder={handleTrackOrder}
          />
        );

      case "addresses":
        return (
          <Addresses
            addresses={addresses}
            onAddAddress={(newAddress) => {
              setAddresses([
                ...addresses,
                {
                  ...newAddress,
                  id: Date.now().toString(),
                  isDefault: addresses.length === 0,
                },
              ]);
            }}
            onUpdateAddress={(id, updatedAddress) => {
              setAddresses(
                addresses.map((addr) =>
                  addr.id === id ? { ...addr, ...updatedAddress } : addr
                )
              );
            }}
            onDeleteAddress={(id) => {
              setAddresses(addresses.filter((addr) => addr.id !== id));
            }}
            onSetDefault={(id) => {
              setAddresses(
                addresses.map((addr) => ({
                  ...addr,
                  isDefault: addr.id === id,
                }))
              );
            }}
          />
        );

      case "security":
        return (
          <SecuritySettings
            onSave={(settings) => {
              console.log('Saving privacy settings:', settings);
              // Here you would typically make an API call to save the settings
              alert('Configuración de privacidad guardada correctamente');
            }}
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Bienvenido a tu panel de usuario
            </h2>
            <p className="text-gray-500 text-sm">
              Selecciona una opción del menú para gestionar tu cuenta, ver tus
              pedidos, direcciones y más.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Cuenta</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <UserMenu
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userData={userData}
        />

        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6 overflow-x-auto">
          <div className="min-w-0 max-w-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
