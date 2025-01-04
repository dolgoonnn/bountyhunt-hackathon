"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "./providers/AuthProvider";
import { WalletButton } from "./wallet-button";

export function Navbar() {
  const pathname = usePathname();
  const { session } = useAuth();

  const navItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Bounties",
      href: "/bounties",
    },
    {
      title: "Create Bounty",
      href: "/bounties/create",
      auth: true,
    },
    {
      title: "My Submissions",
      href: "/dashboard",
      auth: true,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              QuestHub
            </Link>

            <div className="hidden items-center space-x-6 md:flex">
              {navItems.map((item) =>
                !item.auth || session ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ) : null,
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <p className="hidden text-sm text-muted-foreground sm:block">
                  {session.user?.address?.slice(0, 6)}...
                  {session.user?.address?.slice(-4)}
                </p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Profile</Link>
                </Button>
              </div>
            ) : (
              <WalletButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
