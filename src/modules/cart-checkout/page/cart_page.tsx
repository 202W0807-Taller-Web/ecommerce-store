import { Link } from "react-router-dom";

export default function Cart() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Link
        to="/checkout/step1"
        className="bg-[#EBC431] text-[#333027] font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#C0A648] transition"
      >
        Ir al Checkout
      </Link>
    </div>
  );
}