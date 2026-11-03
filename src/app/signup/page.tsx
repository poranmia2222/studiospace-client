"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from "@/components/GoogleIcon";
import { signIn, signUp } from "@/lib/auth-client";
import { LogoMark } from "@/components/Navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [googlePending, setGooglePending] = useState(false);
  const router = useRouter();

  /**
   * OAuth signup: better-auth routes through Google's consent screen and
   * auto-registers the account on first login, then lands on the
   * callbackURL. social() lives on signIn (signUp is email-only).
   */
  const handleGoogle = async () => {
    if (googlePending) return;
    setGooglePending(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (error) {
        toast.error(
          error.message || "Google sign-up is unavailable right now.",
        );
      }
    } catch {
      toast.error("We couldn't reach the sign-up service. Please try again.");
    } finally {
      setGooglePending(false);
    }
  };

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
      password: data.password as string,

    })

    console.log(resData)

    if (error) {
      toast.error(error.message || "Something went wrong. Please try again.")
      return
    }

    if(resData){
      toast.success("Account created successfully! Redirecting to sign in...")
      router.push("/signin")
    }

  };

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
              Create Account
            </p>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Join thousands of creators booking and hosting{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                studios
              </span>
            </CardTitle>
            <CardDescription className="text-muted text-sm">
              Sign up to discover and list creative spaces
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-muted text-xs font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="fullName"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="h-11 rounded-xl border-edge bg-overlay-soft pl-10 text-foreground placeholder:text-muted focus-visible:border-violet-500 focus-visible:ring-violet-500/20 transition-all"
                    required
                  />
                </div>
              </div>


              {/* URL Field */}
              <div className="space-y-2">
                <Label htmlFor="photoUrl" className="text-muted text-xs font-medium">
                  Photo URL
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="photoUrl"
                    type="url"
                    name="url"
                    placeholder="https://example.com"
                    className="h-11 rounded-xl border-edge bg-overlay-soft pl-10 text-foreground placeholder:text-muted focus-visible:border-violet-500 focus-visible:ring-violet-500/20 transition-all"
                    required
                  />
                </div>
              </div>

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
                    className="h-11 rounded-xl border-edge bg-overlay-soft pl-10 text-foreground placeholder:text-muted focus-visible:border-violet-500 focus-visible:ring-violet-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 8 characters"
                    className="h-11 rounded-xl border-edge bg-overlay-soft pl-10 pr-10 text-foreground placeholder:text-muted focus-visible:border-violet-500 focus-visible:ring-violet-500/20 transition-all"
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
              {passwordError && (
                <p className="text-sm text-red-500 mt-2">{passwordError}</p>
              )}

              {/* Submit Button — same pill CTA style as the homepage */}
              <Button
                type="submit"
                className="group h-12 w-full rounded-full border-0 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-base text-white shadow-xl shadow-violet-600/30 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[.98] transition-all mt-2"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>

            {/* Divider + social sign-up */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3 pt-2 text-xs text-muted"
            >
              <span className="h-px flex-1 bg-edge" />
              or continue with
              <span className="h-px flex-1 bg-edge" />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={googlePending}
              onClick={handleGoogle}
              className="h-12 w-full rounded-full border-edge bg-surface text-sm font-medium text-foreground hover:bg-overlay"
            >
              {googlePending ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <GoogleIcon className="ml-1 mr-2 h-4 w-4" />
              )}
              {googlePending ? "Redirecting to Google…" : "Sign up with Google"}
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-edge bg-transparent pt-4 pb-6">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary font-medium hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
