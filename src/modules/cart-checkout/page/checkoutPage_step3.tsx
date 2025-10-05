import { Link} from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";

export default function Checkout_Step3() {
    return (
        <div className="max-w-2xl mx-auto p-8">
            <CheckoutSteps currentStep={3} />

            <h1 className="text-3xl font-bold mb-8 text-center">
                Resumen de envío
            </h1>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
                <Link
                    to="/checkout/step2"
                    className="px-6 py-3 rounded-lg border-2 border-[#C0A648] text-[#EBC431] bg-[#333027] hover:bg-[#413F39]/80 hover:scale-105 hover:border-[#EBC431] transition font-medium"
                >
                    ← Volver a envío
                </Link>
                <Link
                    to="/checkout/step4"
                    className="px-6 py-3 rounded-lg bg-[#F5E27A] text-[#333027] hover:bg-[#EBC431] hover:scale-105 hover:shadow-md border-2 border-[#C0A648]"
                >
                    Confirmar
                </Link>
            </div>
        </div>
    );
}