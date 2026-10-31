"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle signup submission logic
    const password = (e.target as HTMLFormElement).password.value;
    
    if (!/^(?=.*[A-Z])(?=.*[a-z]).{6,}$/.test(password)) {
      setPasswordError(
        "Password must contain uppercase, lowercase, and at least 6 characters."
      );
      return;
    }
    setPasswordError("");

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    const {data:resData, error} = await signUp.email({
      name: data.name as string,
      image: data.url as string,
      email: data.email as string,
      password: data.password as string
    })

    console.log(resData)

  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0512] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.25),rgba(255,255,255,0))] p-4 text-white">
      <Card className="w-full max-w-md bg-white/[0.04] backdrop-blur-xl border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create a <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">StudioSpace</span> Account
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Join thousands of creators booking and hosting studios
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-300 text-xs font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="fullName"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11 transition-all"
                  required
                />
              </div>
            </div>


            {/* URL Field */}
            <div className="space-y-2">
              <Label htmlFor="PhotoURL" className="text-zinc-300 text-xs font-medium">
                Photo URL
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="fullName"
                  type="url"
                  name="url"
                  placeholder="https://example.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 text-xs font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 text-xs font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {passwordError && (
              <p className="text-sm text-red-500 mt-2">{passwordError}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-medium shadow-lg shadow-purple-500/25 transition-all duration-200 mt-2"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-white/5 pt-4 pb-6">
          <p className="text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}