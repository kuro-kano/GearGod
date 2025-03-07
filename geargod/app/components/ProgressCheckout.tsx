
import React from "react";
import Link from "next/link";
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
    <div className="mb-8">
      <div className="bg-white rounded-t-md px-6 py-4">
        <h2 className="text-gray-800 font-bold text-xl">SHOP</h2>
      </div>
      <div className="flex justify-between items-center border-b-2 border-gray-200">
        <nav className="flex w-full" aria-label="Progress">
          <ol role="list" className="flex items-center w-full">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8' : ''}`}>
                {step.status === "complete" ? (
                  <Link
                    href={step.href}
                    className="group flex items-center w-full"
                  >
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-600 rounded-full">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </span>
                      <span className="ml-4 text-lg font-medium text-green-600">{step.name}</span>
                    </span>
                  </Link>
                ) : step.status === "current" ? (
                  <Link
                    href={step.href}
                    className="flex items-center px-6 py-4 text-sm font-medium"
                    aria-current="step"
                  >
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-green-600 rounded-full">
                      <span className="text-green-600">
                        <CheckCircle className="w-6 h-6" />
                      </span>
                    </span>
                    <span className="ml-4 text-lg font-bold text-green-600">{step.name}</span>
                  </Link>
                ) : (
                  <Link
                    href={step.href}
                    className="group flex items-center"
                  >
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full">
                        <span className="text-gray-500 text-lg">{stepIdx + 1}</span>
                      </span>
                      <span className="ml-4 text-medium font-bold text-gray-500">{step.name}</span>
                    </span>
                  </Link>
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