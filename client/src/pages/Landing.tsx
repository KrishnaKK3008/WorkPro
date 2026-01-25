import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layers, Zap, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Zap className="h-6 w-6 text-blue-500" />,
    title: "Instant Execution",
    desc: "Zero-latency updates with our optimized MERN core. Speed is our foundation.",
    accent: "bg-blue-600/20"
  },
  {
    icon: <Users className="h-6 w-6 text-purple-500" />,
    title: "Workforce Intelligence",
    desc: "Role-based analytics that help you distribute workload effectively.",
    accent: "bg-purple-600/20"
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
    title: "Enterprise Shield",
    desc: "Military-grade HttpOnly authentication with strict server-side guards.",
    accent: "bg-emerald-600/20"
  }
];

export default function Landing() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % features.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-[#020202] text-white overflow-hidden relative flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* --- BACKGROUND (Blobs + Dots) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.1] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-600/[0.08] blur-[90px]"
        />
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* 1. NAVBAR (Compact) */}
      <nav className="z-50 pt-4 px-6 shrink-0">
        <div className="max-w-4xl mx-auto flex h-12 items-center justify-between px-5 rounded-full border border-white/5 bg-white/[0.01] backdrop-blur-xl ring-1 ring-white/5">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
              <Layers className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="uppercase tracking-[0.3em] text-[9px] font-black bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Nexus
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">Login</Link>
            <Link to="/register">
              <Button className="bg-white text-black hover:bg-zinc-200 h-7 px-4 rounded-full text-[8px] font-black uppercase tracking-widest">Join Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Tighter spacing) */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 relative z-10 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-400 backdrop-blur-md"
        >
          <span className="h-1 w-1 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_#3b82f6]" />
          Infrastructure for Sprint Excellence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.85] bg-gradient-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent"
        >
          Logic-driven <br /> 
          <span className="text-white">execution.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs md:text-sm text-zinc-500 max-w-sm mx-auto font-medium tracking-tight"
        >
          Consolidate sprints, workforce, and audit trails in a unified interface.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2"
        >
          <Link to="/register">
            <Button size="lg" className="h-12 px-8 text-[9px] font-black uppercase tracking-[0.2em] bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-xl shadow-blue-600/20">
              Launch Workspace <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* 3. FEATURE GLASS SLIDER (Reduced height) */}
      <section className="h-[200px] shrink-0 relative z-10 flex flex-col items-center justify-center mb-4">
        <div className="w-full max-w-xl px-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="relative p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-[30px] overflow-hidden flex items-center gap-6 ring-1 ring-white/5">
                <div className={cn("absolute inset-0 opacity-10 transition-all duration-700", features[index].accent)} />
                
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-zinc-900/50 flex items-center justify-center border border-white/5">
                  {features[index].icon}
                </div>
                
                <div className="text-left relative z-10">
                  <h3 className="text-sm font-black mb-1 tracking-tight text-white uppercase italic">{features[index].title}</h3>
                  <p className="text-zinc-500 text-[10px] leading-relaxed max-w-[200px]">{features[index].desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-6">
            {features.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className="group py-2">
                <div className={cn(
                  "h-[2px] transition-all duration-500 rounded-full",
                  i === index ? "w-8 bg-blue-500" : "w-2 bg-zinc-800"
                )} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOOTER (Ultra Minimal) */}
      <footer className="py-4 text-center shrink-0">
        <p className="text-[7px] font-bold uppercase tracking-[0.5em] text-zinc-800">
          Nexus Engineering Labs © 2026
        </p>
      </footer>

    </div>
  );
}