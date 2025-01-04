"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Home() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const gradientColors = [
    'from-purple-500 via-pink-500 to-red-500',
    'from-blue-500 via-teal-500 to-green-500',
    'from-yellow-500 via-orange-500 to-red-500'
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-3xl"
              style={{
                width: `${Math.random() * 100 + 100}px`,
                height: `${Math.random() * 100 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-6xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-6xl font-bold tracking-tight text-white"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
              Decentralized Bounty Platform
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-green-300">
              for Developers
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8 text-xl text-gray-100"
          >
            Create, complete, and earn from development bounties while building
            your reputation
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/bounties">
              <Button 
                size="lg" 
                className="gap-2 group transition-all duration-300 hover:scale-105 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-none"
              >
                Explore Bounties 
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/bounties/create">
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-lg text-white border-white/20 hover:bg-white/20"
              >
                Create Bounty
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 ">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-4xl font-bold text-white"
          >
            Why Choose QuestHub?
          </motion.h2>
          <motion.div 
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "Secure & Transparent",
                description: "Smart contract-based bounties ensure secure and transparent transactions",
                gradient: "from-cyan-500 to-blue-500"
              },
              {
                icon: Award,
                title: "Build Reputation",
                description: "Earn reputation points by completing bounties and contributing to the ecosystem",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "AI-Powered",
                description: "Submissions are validated using AI to ensure quality and compliance",
                gradient: "from-yellow-500 to-orange-500"
              },
            ].map((feature, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                  >
                    <Card className="p-6 transition-all duration-300 bg-white/10 backdrop-blur-lg border-none hover:shadow-2xl hover:shadow-purple-500/20">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} w-16 h-16 flex items-center justify-center mb-4`}>
                        <feature.icon className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-gray-900/90 backdrop-blur-lg border-gray-700">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-300">
                      Click to learn more about how {feature.title.toLowerCase()} can help you succeed in the ecosystem.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(200px) rotate(0deg) }
          50% { transform: translateY(-400px) rotate(5deg) }
        }
      `}</style>
    </main>
  );
}