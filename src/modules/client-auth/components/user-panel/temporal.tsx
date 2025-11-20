import { useEffect } from "react";
import { fakeLogin } from "../../components/user-panel/fakeLogin";
import { getCurrentUser } from "../../api/auth";

export default function TestLogin() {
  useEffect(() => {
    async function run() {
      await fakeLogin(); // 1. Inicia sesión
      const user = await getCurrentUser(); // 2. Obtiene datos del usuario en sesión
      console.log("👤 Usuario actual:", user);
    }

    run();
  }, []);

  return <div>Probando login...</div>;
}