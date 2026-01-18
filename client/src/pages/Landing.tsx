import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layers, Zap, Users, ShieldCheck, ArrowRight, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: "Instant Execution",
    desc: "Experience zero-latency updates with our optimized MERN core. Speed is not a feature; it's our foundation.",
    accent: "from-blue-600/20 to-transparent"
  },
  {
    icon: <Users className="h-8 w-8 text-purple-500" />,
    title: "Workforce Intelligence",
    desc: "Advanced role-based analytics that help you distribute workload effectively without human bias.",
    accent: "from-purple-600/20 to-transparent"
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
    title: "Enterprise Shield",
    desc: "Military-grade HttpOnly authentication combined with strict server-side validation guards.",
    accent: "from-emerald-600/20 to-transparent"
  }
];

export default function Landing() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % features.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-[#030303] text-white overflow-hidden relative flex flex-col font-sans">
      
      {/* --- BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Blobs */}
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-5%] h-[700px] w-[700px] rounded-full bg-blue-600/[0.08] blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-purple-600/[0.07] blur-[120px]"
        />
        {/* The Dot Grid & Noise */}
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 1. FLOATING NAVBAR */}
      <nav className="z-50 pt-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex h-14 items-center justify-between px-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl ring-1 ring-white/5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span className="uppercase tracking-[0.4em] text-[10px] font-black bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                Syncra
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">
                Login
              </Link>
              <Link to="/register">
                <Button className="bg-white text-black hover:bg-zinc-200 h-8 px-5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-transform active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 relative z-10 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border border-white/5 bg-white/[0.03] px-4 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-10 backdrop-blur-md"
        >
          <span className="h-1 w-1 rounded-full bg-blue-500 mr-3 shadow-[0_0_8px_#3b82f6]" />
          Infrastructure for Sprint Excellence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-8xl font-black tracking-[-0.04em] mb-8 leading-[0.85] bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent"
        >
          Workforce logic <br /> 
          <span className="text-white">reimagined.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm md:text-base text-zinc-500 mb-12 max-w-md mx-auto font-medium leading-relaxed tracking-tight"
        >
          The definitive workspace for modern engineering teams. 
          Unify your tasks, workforce, and history in a single, high-fidelity interface.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <Link to="/register">
            <Button size="lg" className="h-14 px-10 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 rounded-xl">
              Create Free Workspace
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-14 px-10 text-[10px] font-black uppercase tracking-[0.2em] border-white/5 bg-white/[0.01] hover:bg-white/[0.04] rounded-xl backdrop-blur-md">
            Watch Demo
          </Button>
        </motion.div>
      </main>

      {/* 3. FEATURE CAROUSEL */}
      <section className="h-[200px] mb-12 relative z-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="relative p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl overflow-hidden flex items-center gap-10">
                {/* Visual Gradient Background for the Card */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 transition-all duration-1000", features[index].accent)} />
                
                <div className="h-20 w-20 shrink-0 rounded-3xl bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-2xl">
                  {features[index].icon}
                </div>
                
                <div className="text-left relative z-10">
                  <h3 className="text-xl font-black mb-2 tracking-tight text-white uppercase italic">{features[index].title}</h3>
                  <p className="text-zinc-400 text-xs font-medium leading-relaxed max-w-xs">{features[index].desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Minimal Navigation Indicators */}
          <div className="flex justify-center gap-4 mt-8">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="group relative h-4 w-4 flex items-center justify-center"
              >
                <div className={cn(
                  "h-[2px] transition-all duration-700 rounded-full",
                  i === index ? "w-6 bg-blue-500" : "w-2 bg-zinc-800"
                )} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-8 text-center relative z-10">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-zinc-700">
          Syncra Engineering Labs © 2026 • Optimized for High-Growth Teams
        </p>
      </footer>

    </div>
  );
}