"use client";

import { Button } from "@/components/ui/button";
import { LoginButton } from "../components/auth/login-button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { Wrench, Cpu, Shield, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { TranslationKeys } from "@/lib/translations";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const { t } = useTranslation();

  return (
    <main className={cn("min-h-screen bg-[#020617] text-white selection:bg-blue-500/30", font.className)}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {t("platform_subtitle")}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
            >
              {t("hero_title").includes("dengan") ? (
                <>
                  {t("hero_title").split("dengan")[0]} <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {t("hero_title").split("dengan")[1].trim()}
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {t("hero_title")}
                </span>
              )}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              {t("hero_desc")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <LoginButton>
                <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                  {t("start_now")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </LoginButton>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="pt-12 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
            >
              {/* Placeholder for trusted companies or stats */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-sm">{t("enterprise_ready")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-sm">{t("uptime_99")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-sm">{t("iot_integrated")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold italic-gradient">{t("featured_features")}</h2>
            <p className="text-slate-400 md:text-lg">{t("features_desc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wrench className="w-6 h-6" />}
              title={t("ticket_maintenance_title")}
              description={t("ticket_maintenance_desc")}
              color="blue"
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6" />}
              title={t("asset_management_title")}
              description={t("asset_management_desc")}
              color="cyan"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title={t("security_compliance_title")}
              description={t("security_compliance_desc")}
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Stats Section / Social Proof */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatItem label={t("active_users")} value="2,400+" />
            <StatItem label={t("tracked_assets")} value="15k+" />
            <StatItem label={t("tickets_completed")} value="85k" />
            <StatItem label={t("response_time")} value="< 2j" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">{t("cta_title")}</h2>
              <p className="text-blue-100/80 md:text-xl">{t("cta_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: "blue" | "cyan" | "indigo" }) {
  const colorMap = {
    blue: "group-hover:text-blue-400 bg-blue-500/10 border-blue-500/20",
    cyan: "group-hover:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    indigo: "group-hover:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div className="group p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-2">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300", color === "blue" ? "bg-blue-500/20 text-blue-400" : color === "cyan" ? "bg-cyan-500/20 text-cyan-400" : "bg-indigo-500/20 text-indigo-400")}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-[15px]">{description}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}
