"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "./providers/AuthProvider";
import { WalletButton } from "./wallet-button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { session } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-gradient-to-r from-gray-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="relative group">
              <motion.span 
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                QuestHub
              </motion.span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300" />
            </Link>

            <div className="hidden items-center space-x-6 md:flex">
              {navItems.map((item, index) =>
                !item.auth || session ? (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-3 py-2 text-sm font-medium transition-colors group",
                        pathname === item.href
                          ? "text-white"
                          : "text-gray-300 hover:text-white",
                      )}
                    >
                      {item.title}
                      {pathname === item.href && (
                        <motion.span
                          layoutId="navbar-active"
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 -z-10"
                        />
                      )}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                  </motion.div>
                ) : null
              )}
            </div>
          </div>

          {/* Auth Section */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-4"
          >
            {session ? (
              <div className="flex items-center space-x-4">
                <p className="hidden text-sm text-gray-300 sm:block">
                  {session.user?.address?.slice(0, 6)}...
                  {session.user?.address?.slice(-4)}
                </p>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-pink-500/40 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/dashboard">Profile</Link>
                </Button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }}>
                <WalletButton />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}