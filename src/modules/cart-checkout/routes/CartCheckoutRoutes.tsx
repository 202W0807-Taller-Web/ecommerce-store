import { Routes, Route } from "react-router-dom";
import Cart from "../page/cart_page";
import Checkout_Step1 from "../page/checkoutPage_step1";

export default function CartCheckoutRoutes() {
  return (
    <Routes>
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout/step1" element={<Checkout_Step1 />} />
    </Routes>
  );
}