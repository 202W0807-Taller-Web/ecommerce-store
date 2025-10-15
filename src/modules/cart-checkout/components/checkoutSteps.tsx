type CheckoutStepsProps = {
  currentStep: number; // 1, 2 o 3
};

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 1, label: "Método" },
    { id: 2, label: "Envío" },
    { id: 3, label: "Confirmación" },
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {/* Circulo del paso */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold border-2 transition-all duration-300
                ${isActive
                  ? "bg-[#EBC431] text-[#333027] border-[#C0A648]"
                  : isCompleted
                    ? "bg-[#C0A648] text-[#333027] border-[#EBC431]"
                    : "bg-[#413F39] text-[#F5F5F5] border-[#6B644C]"
                }`}
            >
              {step.id}
            </div>

            {/* Etiqueta */}
            <span
              className={`ml-3 text-sm font-medium transition-colors 
                ${isActive
                  ? "text-[#EBC431]"
                  : isCompleted
                    ? "text-[#C0A648]"
                    : "text-[#F5F5F5]/70"
                }`}
            >
              {step.label}
            </span>

            {/* Línea conectora */}
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-[2px] mx-4 transition-all
                  ${isCompleted ? "bg-[#EBC431]" : "bg-[#6B644C]"}
                `}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
