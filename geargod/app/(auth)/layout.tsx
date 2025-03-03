// app/(auth)/layout.tsx
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="auth-layout">{children}</div>
      </div>
    );
  }