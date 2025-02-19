import Navbar from "./components/Navbar";
import "./globals.css"; 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-800">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
