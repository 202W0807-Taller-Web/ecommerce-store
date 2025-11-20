import { useEffect, useState } from "react";
import {
  UserMenu,
  UserProfile,
  OrderHistory,
  Addresses,
  SecuritySettings,
} from "../components/user-panel";

//Para cargar direcciones y datos del usuario
import { getUserAddresses, updateAddress, addAddress, deleteAddress, setDefaultAddress } from "../api/addresses";
import { useAuth } from "../hooks/useAuth";

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

  // ⬇️ AQUI va perfectamente
  const { user, loading } = useAuth();

  const [addresses, setAddresses] = useState<any[]>([]);

  const [userData, setUserData] = useState<UserData>({
    name: "Loading...",
    email: "",
    phone: "",
    memberSince: "",
  });

  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      try {
        const data = await getUserAddresses(user.id);
        setAddresses(data);
      } catch (error) {
        console.error("Error al obtener direcciones:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  // OJO: este useEffect debe esperar a `user`
  useEffect(() => {

    if (!user) return;


    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${user.id}`);
        const data = await response.json();

        setUserData({
          name: `${data.nombres} ${data.apellido_p} ${data.apellido_m}`,
          email: data.correo,
          phone: data.celular ?? "",
          memberSince: new Date(data.created_at).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "long",
          }),
        });

      } catch (error) {
        console.error("Error al obtener información del usuario:", error);
      }
    };

    fetchUserInfo();
  }, [user]);


  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Debes iniciar sesión para ver esta página.</div>;
  }

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
            onAddAddress={async (newAddress) => {
              /*try {
                const created = await addAddress(user.id, newAddress);
                setAddresses([...addresses, created]);
              } catch (err) {
                console.error(err);
                alert("No se pudo crear la dirección");
              }*/
              try {
                await addAddress(user.id, newAddress);
                
              } catch (error: any) {
                console.log("➡️ Datos a enviar:", newAddress);
                console.error("ERROR AL CREAR DIRECCIÓN:", error.response?.data || error);
                alert("No se pudo crear la dirección");
              }

            }}

            onUpdateAddress={async (id, updatedAddress) => {
              try {
                const updated = await updateAddress(id, updatedAddress);

                // Actualiza el estado con lo que devolvió el backend
                setAddresses(addresses.map(a => a.id === id ? updated : a));

              } catch (err) {
                console.error("Error al actualizar dirección:", err);
                alert("Hubo un problema al actualizar la dirección.");
              }
            }}
            onDeleteAddress={async (id) => {
              try {
                await deleteAddress(id);
                setAddresses(addresses.filter(addr => addr.id !== id));
              } catch (err) {
                console.error("Error al eliminar dirección:", err);
                alert("No se pudo eliminar");
              }
            }}
            onSetDefault={async (id) => {
              try {
                const updatedList = await setDefaultAddress(id);
                setAddresses(updatedList);
              } catch (err) {
                console.error("Error al establecer default:", err);
              }
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
