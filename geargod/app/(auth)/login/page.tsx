"use client";
import LoginForm from "@/components/LoginForm";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  if (!isClient) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img src="images/login.png" alt="Background" className="object-cover" />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
        {/* Ensure the text and LoginForm are centered */}
        
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
