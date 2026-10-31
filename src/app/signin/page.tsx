"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login submission logic
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0512] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.25),rgba(255,255,255,0))] p-4 text-white">
      <Card className="w-full max-w-md bg-white/[0.04] backdrop-blur-xl border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">StudioSpace</span>
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@example.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-zinc-300 text-xs font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11 transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-medium shadow-lg shadow-purple-500/25 transition-all duration-200 mt-2"
            >
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-white/5 pt-4 pb-6">
          <p className="text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}