import React from "react";
import { CheckCircle } from "lucide-react";

// Define the step interface
export interface Step {
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming";
}

interface CheckoutStepperProps {
  steps: Step[];
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ steps }) => {
  return (
    <div className="dark mb-8">
      <div className="bg-white rounded-t-md px-4 sm:px-6 py-4">
        <h2 className="text-gray-800 font-bold text-lg sm:text-xl">SHOP</h2>
      </div>
      <div className="border-b-2 border-gray-200">
        <nav className="overflow-x-auto" aria-label="Progress">
          {/* Mobile version (vertical for very small screens) */}
          <ol className="flex flex-col space-y-2 py-2 sm:hidden">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative">
                <span
                  className={`flex items-center px-4 py-2 ${
                    step.status === "complete" || step.status === "current"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                    step.status === "complete" 
                      ? "bg-green-600" 
                      : step.status === "current"
                      ? "border-2 border-green-600"
                      : "border-2 border-gray-300"
                  }`}>
                    {step.status === "complete" ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : step.status === "current" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <span className="text-gray-500 text-xs">{stepIdx + 1}</span>
                    )}
                  </span>
                  <span className={`text-sm ${
                    step.status === "current" ? "font-bold" : "font-medium"
                  }`}>
                    {step.name}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          {/* Tablet and desktop version (horizontal) */}
          <ol className="hidden sm:flex items-center w-full">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8' : ''}`}>
                {step.status === "complete" ? (
                  <span className="group flex items-center w-full">
                    <span className="flex items-center px-3 md:px-6 py-3 md:py-4 text-sm font-medium">
                      <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-green-600 rounded-full">
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </span>
                      <span className="ml-3 md:ml-4 text-base md:text-lg font-medium text-green-600">{step.name}</span>
                    </span>
                  </span>
                ) : step.status === "current" ? (
                  <span className="flex items-center px-3 md:px-6 py-3 md:py-4 text-sm font-medium">
                    <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 border-green-600 rounded-full">
                      <span className="text-green-600">
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                      </span>
                    </span>
                    <span className="ml-3 md:ml-4 text-base md:text-lg font-bold text-green-600">{step.name}</span>
                  </span>
                ) : (
                  <span className="group flex items-center">
                    <span className="flex items-center px-3 md:px-6 py-3 md:py-4 text-sm font-medium">
                      <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 border-gray-300 rounded-full">
                        <span className="text-gray-500 text-base md:text-lg">{stepIdx + 1}</span>
                      </span>
                      <span className="ml-3 md:ml-4 text-base md:text-lg font-bold text-gray-500">{step.name}</span>
                    </span>
                  </span>
                )}

                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default CheckoutStepper;