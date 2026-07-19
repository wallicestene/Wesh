"use client";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Radar, CheckCircle2, Bell, Search } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export default function Banner() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="container py-20 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* Left */}
          <motion.div
            className="flex flex-col gap-6"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.08 }}
          >
            <Badge
              className="w-fit rounded-full border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm"
              variant="outline"
              asChild
            >
              <motion.div variants={fadeUp}>
                <MapPin className="size-4 text-wesh-teal" />
                San Francisco rentals, watched for you
              </motion.div>
            </Badge>

            <motion.div className="flex flex-col gap-1" variants={fadeUp}>
              <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
                Your apartment hunt,
              </h1>
              <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[0.98] tracking-normal text-wesh-pine md:text-6xl lg:text-7xl">
                on autopilot.
              </h1>
            </motion.div>

            <motion.p
              className="max-w-xl font-sans text-base leading-7 text-muted-foreground md:text-lg"
              variants={fadeUp}
            >
              Describe the place you want in plain English. Wesh keeps track of
              San Francisco rental activity and helps surface options that match
              your budget, neighborhoods, and preferences.
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 pt-1 sm:flex-row"
              variants={fadeUp}
            >
              <a href="#chat" className="h-11 text-sm flex items-center rounded-full bg-wesh-pine px-5 text-white shadow-sm shadow-wesh-pine/15 transition hover:-translate-y-0.5 hover:bg-wesh-teal">
                Start a search
                <ArrowRight className="size-4" />
              </a>

              <Button
                className="h-11 rounded-full border-wesh-pine/25 bg-card/60 px-5 text-wesh-pine transition hover:-translate-y-0.5 hover:bg-wesh-mint/40"
                variant="outline"
              >
                How Wesh works
              </Button>
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            className="relative hidden min-h-117.5 md:block"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-x-8 top-12 h-px bg-border/80" />
            <div className="pointer-events-none absolute bottom-20 left-10 right-6 h-px bg-border/60" />
            <div className="pointer-events-none absolute bottom-10 right-16 top-8 w-px bg-border/60" />

            {/* Card 1: Top Left */}
            <motion.div
              className="absolute left-2 top-4 z-30 w-[82%]"
              initial={{ opacity: 0, y: 20, scale: 0.98, rotate: 0.4 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -4, 0, 3, 0],
                rotate: [0.4, 0.1, 0.35, 0.6, 0.4],
              }}
              transition={{
                opacity: { duration: 0.55, delay: 0.25 },
                scale: { duration: 0.55, delay: 0.25 },
                y: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                },
                rotate: {
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                },
              }}
              whileHover={{
                y: -6,
                scale: 1.015,
                rotate: 0,
                transition: { type: "spring", stiffness: 260, damping: 22 },
              }}
            >
              <Card className="border-border/80 bg-card/90 shadow-[0_24px_70px_rgba(9,20,19,0.10)] backdrop-blur-md">
                <CardContent className="relative p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active search
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
                        Studio in Mission or SoMA
                      </h2>
                    </div>
                    <motion.div
                      className="flex size-10 items-center justify-center rounded-full border border-wesh-pine/10 bg-wesh-mint text-wesh-ink shadow-sm"
                      animate={{ rotate: [0, 8, 0, -8, 0] }}
                      transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Radar className="size-5" />
                    </motion.div>
                  </div>
                  <p className="text-base leading-7 text-muted-foreground">
                    “I’m looking for a studio under $2,300 in Mission or SoMA.”
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2: Criteria */}
            <motion.div
              className="absolute right-0 top-44 z-20 w-[72%]"
              initial={{ opacity: 0, y: 18, scale: 0.98, rotate: -0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -3, 0, 3, 0],
                rotate: [-0.5, -0.2, -0.45, -0.75, -0.5],
              }}
              transition={{
                opacity: { duration: 0.55, delay: 0.35 },
                scale: { duration: 0.55, delay: 0.35 },
                y: {
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
                rotate: {
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
              whileHover={{
                y: -6,
                scale: 1.015,
                rotate: 0,
                transition: { type: "spring", stiffness: 260, damping: 22 },
              }}
            >
              <Card className="border border-wesh-pine/10 bg-wesh-mint/70 shadow-[0_18px_50px_rgba(9,20,19,0.08)] backdrop-blur-md">
                <CardContent className="relative space-y-3 p-5">
                  {[
                    ["Budget", "Under $2,300"],
                    ["Bedrooms", "Studio"],
                    ["Neighborhoods", "Mission, SoMA"],
                  ].map(([label, value], index) => (
                    <motion.div
                      key={label}
                      className="flex items-center justify-between gap-4"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.35 + index * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      <span className="text-sm text-wesh-pine">{label}</span>
                      <span className="text-sm font-semibold text-wesh-ink">
                        {value}
                      </span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3: Search Ready */}
            <motion.div
              className="absolute bottom-6 left-10 z-10 w-[76%]"
              initial={{ opacity: 0, y: 22, scale: 0.98, rotate: 0.35 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, 4, 0, -3, 0],
                rotate: [0.35, 0.1, 0.3, 0.55, 0.35],
              }}
              transition={{
                opacity: { duration: 0.55, delay: 0.45 },
                scale: { duration: 0.55, delay: 0.45 },
                y: {
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                },
                rotate: {
                  duration: 13,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                },
              }}
              whileHover={{
                y: -6,
                scale: 1.015,
                rotate: 0,
                transition: { type: "spring", stiffness: 260, damping: 22 },
              }}
            >
              <Card className="border-border/80 bg-card/95 shadow-[0_18px_50px_rgba(9,20,19,0.08)] backdrop-blur-md">
                <CardContent className="relative flex items-center gap-3 p-5">
                  <motion.div
                    className="flex size-10 items-center justify-center rounded-full border border-wesh-mint/40 bg-wesh-pine text-white shadow-sm"
                    animate={{
                      scale: [1, 1.04, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(176, 228, 204, 0.28)",
                        "0 0 0 8px rgba(176, 228, 204, 0)",
                        "0 0 0 0 rgba(176, 228, 204, 0)",
                      ],
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <CheckCircle2 className="size-5" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.55,
                      ease: "easeOut",
                    }}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      Search ready
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Wesh can use this preference to watch the SF rental
                      market.
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-2 z-0 w-[46%]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="border-border/70 bg-background/70 shadow-sm backdrop-blur-md">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Search className="size-3.5 text-wesh-teal" />
                      Sources
                    </div>
                    <Bell className="size-3.5 text-wesh-pine" />
                  </div>
                  <div className="space-y-2">
                    {["HotPads", "Craigslist", "Apartments.com"].map(
                      (source, index) => (
                        <div
                          className="flex items-center justify-between text-xs"
                          key={source}
                        >
                          <span className="text-muted-foreground">
                            {source}
                          </span>
                          <motion.span
                            className="h-1.5 w-10 rounded-full bg-wesh-teal/40"
                            animate={{ opacity: [0.35, 1, 0.35] }}
                            transition={{
                              duration: 2.8,
                              repeat: Infinity,
                              delay: index * 0.35,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
