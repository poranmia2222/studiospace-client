"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { LogoMark } from "@/components/Navbar";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login submission logic
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const { data: resData, error } = await signIn.email({
      email: data.email as string,
      password: data.password as string,
      callbackURL: callbackUrl,
    })

    if (error) {
      toast.error(error.message || "Invalid email or password.")
      return
    }

    if (resData) {
      toast.success("Signed in successfully. Welcome back!")
    }
  }
  return (
    <div className="relative flex-1 overflow-hidden bg-background px-4 py-16 sm:py-24">
      {/* Ambient glows — same treatment as the homepage hero (Banner). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-[-10%] h-[560px] w-[560px] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-[-30%] right-[-5%] h-[480px] w-[480px] rounded-full bg-fuchsia-600/15 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center">
        <Card className="w-full max-w-md rounded-2xl border border-edge bg-surface text-foreground shadow-2xl shadow-violet-600/10">
          <CardHeader className="space-y-2 text-center pt-8 pb-4">
            <div className="mx-auto mb-2 flex items-center gap-2.5">
              <LogoMark />
              <span className="text-lg font-semibold tracking-tight">
                Studio<span className="text-muted">Space</span>
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Welcome Back
            </p>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Sign in to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                StudioSpace
              </span>
            </CardTitle>
            <CardDescription className="text-muted text-sm">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted text-xs font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="h-11 rounded-xl border-edge bg-white/[.04] pl-10 text-foreground placeholder:text-muted focus-visible:border-violet-500 focus-visible:ring-violet-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-muted text-xs font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    name="password"
                    className="h-11 rounded-xl border-edge bg-white/[.04] pl-10 pr-10 text-foreground placeholder:text-muted focus-visible:border-violet-500 focus-visible:ring-violet-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button — same pill CTA style as the homepage */}
              <Button
                type="submit"
                className="group h-12 w-full rounded-full border-0 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-base text-white shadow-xl shadow-violet-600/30 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[.98] transition-all mt-2"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-edge bg-transparent pt-4 pb-6">
            <p className="text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
