"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { showToast } from "./ToastAlert";

export default function SignUpForm() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password != confirmPassword) return;

    if (!username || !email || !password || !confirmPassword) return;

    try {
      const resVerify = await fetch("http://localhost:3000/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resVerify.json();
      if (user) return;

      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target as HTMLFormElement;
        showToast({
          title: "Registration Successful",
          description: "You have successfully registered.",
          color: "success",
        })
        form.reset();
      } else {
        console.log("User registration failed..");
        showToast({
          title: "Registration Failed",
          description: "User registration failed. Please try again.",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error during Registration: ", error);
    }

    router.replace("/login");
    console.log("handleSubmit");
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

          <h1 className="text-large font-medium">
            Let&apos;s create your account
          </h1>
          <p className="text-small text-default-500">
            to continue shopping with GearGod
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            onChange={(e) => setUsername(e.target.value)}
            isRequired
            label="Username"
            name="username"
            placeholder="Enter your username"
            type="username"
            variant="bordered"
          />
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
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            label="Confirm Password"
            name="password"
            placeholder="Confirm your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox isRequired className="py-4" size="sm">
              I agree with the&nbsp;
              <Link
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                size="sm"
                className="z-10" // Ensuring the link is clickable by giving it a higher z-index
              >
                Terms
              </Link>
              &nbsp;and&nbsp;
              <Link
                href="https://www.youtube.com/watch?v=Ap-gi3LrCoA"
                size="sm"
                className="z-10" // Same as above
              >
                Privacy Policy
              </Link>
            </Checkbox>
          </div>
          <Button className="w-full" color="primary" type="submit">
            Sign In
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
          Already have an account? &nbsp;
          <Link href="/login" size="sm">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
