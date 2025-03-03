// app/(auth)/layout.tsx

import { Providers } from "@/providers";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main>{children}</main>
    </Providers>
  );
}
