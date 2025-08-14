"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { email, z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(1, "Password at least 8 characters"),
});

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    if (!agree) return;
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/auth/login`, values, {
        withCredentials: true,
      });
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to login:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-screen-lg mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription className="text-base text-black">
          Login to access{" "}
          <span className="text-lg font-semibold text-[#0ABEB3]">
            Style-Mert
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className=" space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className=" focus-visible:ring-0"
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className=" relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        {...field}
                        className="focus-visible:ring-0 "
                        disabled={loading}
                      />
                    </FormControl>
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {" "}
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                className="mt-1"
                checked={agree}
                onCheckedChange={(checked) => setAgree(!!checked)}
              />
              <p className="text-sm text-muted-foreground">I agree with the</p>
              <Link
                className="text-sm text-blue-500 hover:underline"
                href={"/privacy"}
              >
                Privacy Policy
              </Link>
              <span className="text-sm">and</span>
              <Link
                href={"/terms"}
                className="text-sm text-blue-500 hover:underline"
              >
                Terms of use
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full flex items-center gap-1 py-5"
              disabled={!agree || loading}
            >
              <LogIn size={15} className="mt-1" />
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-5 items-center justify-center">
        <div className="flex items-center justify-center gap-x-1">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?
          </p>
          <Link
            href={"/auth/signup"}
            className="text-sm text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-base font-semibold text-black/60">
            About our website
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground text-center">
            Welcome to our platform, where you can explore a wide range of
            products, manage your cart, and track orders seamlessly. We aim to
            provide a user-friendly shopping experience with secure transactions
            and personalized features.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-base font-semibold text-black/60">Data Rules</h1>
          <div className="inline-block ">
            <p className="max-w-4xl text-center text-sm text-muted-foreground">
              Your privacy is our priority. We collect only necessary data
              (e.g., name, email) to process orders and enhance your experience.
              All data is encrypted and stored securely, and we never share it
              with third parties without consent. For details, see our{" "}
              <Link
                className="text-sm text-blue-500 hover:underline"
                href={"/privacy"}
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
