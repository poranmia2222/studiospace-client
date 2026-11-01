"use client";

import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// No "#": hash links (like "/#about-us") scroll to a section on the home
// page, so they never count as the "active route" below.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about-us" },
] as const;

/** Logo mark: a light-bolt inside a violet gradient tile (studio lighting).
 * Exported so the footer can reuse the exact same logo. */
export function LogoMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-600/30">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
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

const Navbar = () => {
  // usePathname() returns the current URL path, e.g. "/" or "/studios".
  const pathname = usePathname();

  const { data: session } = useSession()
  const user = session?.user;
  console.log(user)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully.")
    } catch {
      toast.error("Failed to sign out. Please try again.")
    }
  }

  return (
    // sticky top-0 = header stays pinned while scrolling; z-50 keeps it above
    // other content; backdrop-blur = frosted-glass look over the page.
    <header className="sticky top-0 z-50 w-full border-b border-edge bg-background/80 backdrop-blur-md">
      {/* Center links use absolute positioning inside this relative nav,
          which guarantees they're perfectly centered between logo & buttons. */}
      <nav className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight">
            Studio<span className="text-muted">Space</span>
          </span>
        </Link>

        {/* Center: nav links (hidden on small screens — mobile menu TODO) */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            // Active-state logic: hash links are never "active"; for normal
            // links, "/" only matches the homepage exactly, other routes can
            // match by prefix.
            const isHashLink = href.includes("#");
            const isActive = !isHashLink &&
              (href === "/" ? pathname === "/" : pathname.startsWith(href));

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${isActive
                    ? "bg-white/[.07] font-medium text-foreground"
                    : "text-muted hover:bg-white/[.04] hover:text-foreground"
                    }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: auth actions (placeholder pages until real auth lands) */}
        <div className="flex items-center gap-2.5">
          {session ? <div className="flex items-center gap-2.5">
            <p className="hidden max-w-28 truncate text-sm font-medium sm:block">
              {user?.name}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full"><Avatar>
                <AvatarImage src={user?.image as string} alt={user?.name ?? "Profile"} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar></Button>} />
              {/* align="end" anchors the menu's RIGHT edge to the avatar so it
                  opens leftward instead of overflowing past the screen edge. */}
              <DropdownMenuContent align="end" sideOffset={8} className="w-56 bg-surface border border-edge text-foreground">
                <div className="flex flex-col gap-0.5 border-b border-edge px-2 pb-2 pt-2.5">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-muted">{user?.email}</p>
                </div>
                <DropdownMenuGroup className="">
                  <DropdownMenuItem><Link href={'/add-new-studio'}>Add New Studio</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link href={'/my-studio-listing'}>My Studio Listings</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link href={'/my-bookings'}>My Bookings</Link></DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Button className="" onClick={handleSignOut}>Log out</Button>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
            : <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="hidden h-9 items-center rounded-full border border-edge px-4 text-sm font-medium text-foreground transition-colors hover:border-muted hover:bg-white/[.04] sm:flex"
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
          }
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
