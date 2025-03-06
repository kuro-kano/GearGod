"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastAlert";

export default function LoginForm() {
  // * login
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();

  // * visible
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // * loading
  const [isLoading, setIsLoading] = React.useState(false);

  // * handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            showToast({
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
                color: "danger",
            });
            return;
        }

        // Get fresh session after login
        const session = await getSession();

        // Type guard to ensure roles exists
        if (!session?.user?.roles) {
            showToast({
                title: "Error",
                description: "User role not found",
                color: "danger",
            });
            return;
        }

        // Role-based routing
        switch (session.user.roles.toLowerCase()) {
            case "staff":
                router.push("/admin");
                break;
            case "customer":
                router.push("/");
                break;
            default:
                console.warn("Unknown role:", session.user.roles);
                router.push("/");
        }

        showToast({
            title: "Success",
            description: "Login successful!",
            color: "success",
        });

    } catch (error) {
        console.error("Login error:", error);
        showToast({
            title: "Error",
            description: "An error occurred during login.",
            color: "danger",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center backdrop-filter backdrop-blur-sm bg-opacity-25">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col gap-1">
          <Link href="/">
          <Button color="default" variant="ghost" className="w-[147px] mb-5">
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M5 12l4-4m-4 4 4 4"
              />
            </svg>
            Back to home
          </Button>
          </Link>
          
          <h1 className="text-large font-medium">Sign in to your account</h1>
          <p className="text-small text-default-500">to continue to GearGod</p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button 
            className="w-full" 
            color="primary" 
            type="submit" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Continue with Google
          </Button>
        </div>
        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="/signup" size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
