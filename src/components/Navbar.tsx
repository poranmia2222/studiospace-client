
"use client";

import React, { Suspense, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  CalendarDays,
  LogOut,
} from "lucide-react";

// Navigation links
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about-us" },
] as const;

// Logo
export function LogoMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-600/30">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          d="M13 2 4.5 13.5h5L9 22l8.5-11.5h-5L13 2Z"
          fill="white"
          stroke="white"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// Active link checker
const isActiveLink = (pathname: string, href: string) => {
  if (href.includes("#")) return false;

  return href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
};

// Desktop navigation
const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
      {NAV_LINKS.map(({ label, href }) => {
        const active = isActiveLink(pathname, href);

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-[12px] lg:text-sm  transition-colors ${
                active
                  ? "bg-overlay font-medium text-foreground"
                  : "text-muted hover:bg-overlay-soft hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

// Mobile navigation
const MobileNavLinks = ({
  onNavigate,
}: {
  onNavigate: () => void;
}) => {
  const pathname = usePathname();

  return (
    <ul className="grid gap-1">
      {NAV_LINKS.map(({ label, href }) => {
        const active = isActiveLink(pathname, href);

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-overlay-soft hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

// Profile dropdown
const ProfileDropdown = ({
  user,
  handleSignOut,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  handleSignOut: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Open profile menu"
          >
            <Avatar>
              <AvatarImage
                src={user.image ?? ""}
                alt={user.name ?? "Profile"}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 border border-edge bg-surface text-foreground"
      >
        <div className="flex flex-col gap-0.5 border-b border-edge px-3 pb-3 pt-2.5">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
        </div>

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/add-new-studio" className="flex">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Studio
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem >
            <Link href="/my-studio-listing" className="flex">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              My Studio Listings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/my-bookings" className="flex">
              <CalendarDays className="mr-2 h-4 w-4" />
              My Bookings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-rose-500 focus:text-rose-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
      toast.success("Signed out successfully.");
      router.push("/signin");
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-edge bg-background/90 backdrop-blur-xl">

      {/* Main Navbar */}
      <nav className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileMenuOpen(false)}
        >
          <LogoMark />

          <span className="text-lg font-semibold tracking-tight">
            Studio<span className="text-muted">Space</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <Suspense fallback={null}>
          <NavLinks />
        </Suspense>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          <ThemeToggle />

          {session ? (
            <>
              {/* Desktop user name */}
              <p className="hidden max-w-28 truncate text-sm font-medium sm:block">
                {user?.name}
              </p>

              <ProfileDropdown
                user={user ?? {}}
                handleSignOut={handleSignOut}
              />
            </>
          ) : (
            <>
              {/* Desktop authentication */}
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href="/signin"
                  className="flex h-9 items-center rounded-full border border-edge px-4 text-sm font-medium transition-colors hover:bg-overlay-soft"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div className="min-h-0">
          <div className="mx-auto max-w-6xl border-t border-edge px-4 py-4 sm:px-6">

            {/* Mobile Navigation Links */}
            <Suspense fallback={null}>
              <MobileNavLinks
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </Suspense>

            {/* Mobile Authentication */}
            {!session && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-edge pt-4">
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>

                <Button
                  className="w-full rounded-xl"
                >
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile User Account */}
            {session && (
              <div className="mt-4 border-t border-edge pt-4">
                <div className="mb-3 flex items-center gap-3 px-3">
                  <Avatar>
                    <AvatarImage
                      src={user?.image ?? ""}
                      alt={user?.name ?? "Profile"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid gap-1">
                  <Link
                    href="/add-new-studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted hover:bg-overlay-soft hover:text-foreground"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add New Studio
                  </Link>

                  <Link
                    href="/my-studio-listing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted hover:bg-overlay-soft hover:text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    My Studio Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted hover:bg-overlay-soft hover:text-foreground"
                  >
                    <CalendarDays className="h-4 w-4" />
                    My Bookings
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-rose-500 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
