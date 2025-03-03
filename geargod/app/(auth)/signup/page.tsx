"use client";
import SignUpForm from "@/components/SignUpForm";
import { useEffect, useState } from "react";

const ImageBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  if (!isClient) return null; // Prevent rendering on the server

  return (
    <html>
      <body>
        <main>
          <div className="relative w-full h-screen overflow-hidden">
            {/* Background Image */}
            <img
              src="/images/login.png" // Path to your image file
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
      </body>
    </html>
  );
};

export default ImageBackground;
