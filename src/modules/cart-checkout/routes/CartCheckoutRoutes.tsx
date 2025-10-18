import { Routes, Route } from "react-router-dom";
import Cart from "../page/cart_page";
import Checkout_Step1 from "../page/checkoutPage_step1";
import Checkout_Step2 from "../page/checkoutPage_step2";
import Checkout_Step3 from "../page/checkoutPage_step3";
import Checkout_Step4 from "../page/checkoutPage_step4";

export default function CartCheckoutRoutes() {
  return (
    <Routes>
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout/step1" element={<Checkout_Step1 />} />
      <Route path="/checkout/step2" element={<Checkout_Step2 />} />
      <Route path="/checkout/step3" element={<Checkout_Step3 />} />
      <Route path="/checkout/step4" element={<Checkout_Step4 />} />
    </Routes>
  );
}