"use client";
import SignUpForm from "@/components/SignUpForm";
import { useEffect, useState } from "react";

const SignUpPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <main>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/login.png"
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          {/* Ensure the text and LoginForm are centered */}
          <SignUpForm />
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
