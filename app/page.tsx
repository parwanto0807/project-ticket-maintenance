import { Button } from "@/components/ui/button";
import { LoginButton } from "../components/auth/login-button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { Wrench, Cpu, Shield, TrendingUp } from "lucide-react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="space-y-8">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="p-3 bg-blue-500/20 rounded-2xl backdrop-blur-sm border border-blue-500/30">
                <Wrench className="w-8 h-8 text-blue-400" />
              </div>
              <div className="p-3 bg-green-500/20 rounded-2xl backdrop-blur-sm border border-green-500/30">
                <Cpu className="w-8 h-8 text-green-400" />
              </div>
              <div className="p-3 bg-purple-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <h1 className={cn(
              "text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent",
              font.className
            )}>
              AssetFlow
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Intelligent Maintenance & Asset Management Platform
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-blue-200 text-sm md:text-base">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>Predictive Maintenance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Asset Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Real-time Monitoring</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Wrench className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Maintenance Tickets</h3>
              <p className="text-blue-100 text-sm">Streamlined ticket management with automated workflows</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Cpu className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Asset Management</h3>
              <p className="text-blue-100 text-sm">Complete lifecycle tracking for all your assets</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Security First</h3>
              <p className="text-blue-100 text-sm">Enterprise-grade security for your maintenance data</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6 mt-8">
            <p className="text-blue-100 text-lg">
              Secure access to your maintenance dashboard
            </p>
            <div className="flex justify-center">
              <LoginButton>
                <Button 
                  variant={"default"} 
                  size={"lg"} 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Sign in to Dashboard
                </Button>
              </LoginButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}