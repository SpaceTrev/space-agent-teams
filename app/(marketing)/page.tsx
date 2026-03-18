"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, ChevronRight, Play, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------
// Utility: Noise Overlay
// -----------------------------------------------------
function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay">
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}

// -----------------------------------------------------
// Component A: NAVBAR
// -----------------------------------------------------
function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top -50",
      end: 99999,
      onToggle: (self) => setIsScrolled(self.isActive),
      onUpdate: (self) => {
        if (self.direction === 1) {
          gsap.to(navRef.current, { y: -100, duration: 0.3, ease: 'power2.inOut' });
        } else {
          gsap.to(navRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
        }
      }
    });
  });

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-5xl rounded-full border transition-all duration-500 ease-out flex items-center h-14 ${isScrolled ? 'bg-obsidian-900/80 backdrop-blur-md border-obsidian-700 shadow-xl' : 'border-transparent'}`}
    >
      <div className="flex h-full w-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-champagne-500/10 text-champagne-500 group-hover:bg-champagne-500 group-hover:text-obsidian-900 transition-colors">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white font-serif">Agent OS</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
          <Link href="#features" className="hover:text-champagne-500 hover:-translate-y-[1px] transition-all">Features</Link>
          <Link href="#protocol" className="hover:text-champagne-500 hover:-translate-y-[1px] transition-all">Protocol</Link>
          <Link href="#pricing" className="hover:text-champagne-500 hover:-translate-y-[1px] transition-all">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="group relative overflow-hidden rounded-full bg-obsidian-800 px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
          >
            <span className="absolute inset-0 bg-champagne-500 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0" />
            <span className="relative z-10 group-hover:text-obsidian-900 transition-colors">Deploy</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// -----------------------------------------------------
// Component B: HERO
// -----------------------------------------------------
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2 })
      .fromTo('.hero-title-1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
      .fromTo('.hero-title-2', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
      .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
      .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.6");
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative flex h-[100dvh] w-full items-center overflow-hidden bg-obsidian-900 font-sans">
      {/* Background Image / Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Cybernetic core"
          className="h-full w-full object-cover opacity-10 mix-blend-luminosity grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/90 to-transparent" />
        <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-champagne-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 lg:px-8">
        <div className="max-w-3xl">
          <div className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-champagne-500/20 bg-champagne-500/10 px-3 py-1 text-xs font-medium text-champagne-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne-500"></span>
            </span>
            Midnight Luxe Framework
          </div>
          
          <h1 className="mb-6 flex flex-col font-bold tracking-tighter text-white">
            <span className="hero-title-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 font-serif font-medium">
              Intelligence as an
            </span>
            <span className="hero-title-2 text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] italic text-champagne-500 font-serif font-light leading-tight">
              engineering discipline.
            </span>
          </h1>
          
          <p className="hero-desc text-lg sm:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed font-sans font-light">
            Deploy model-agnostic agent teams. Track margins. Master your sprints.
            Built for those who orchestrate intelligence like a real engineering org.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="hero-cta group relative overflow-hidden rounded-full bg-champagne-500 px-8 py-4 font-semibold text-obsidian-900 transition-transform hover:scale-[1.03]"
            >
              <span className="absolute inset-0 bg-champagne-400 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0" />
              <span className="relative z-10 flex items-center gap-2">
                Start deploying agents <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="#demo"
              className="hero-cta group flex items-center gap-2 rounded-full border border-obsidian-700 bg-obsidian-800/50 px-8 py-4 font-medium text-slate-200 backdrop-blur-sm transition-all hover:bg-obsidian-800 hover:text-champagne-500"
            >
              <Play className="h-4 w-4 fill-slate-400 group-hover:fill-champagne-500 transition-colors" />
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------
// Feature Card: Scheduler (Sprints & Standups)
// -----------------------------------------------------
function FeatureScheduler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    
    tl.set(cursorRef.current, { x: 150, y: 100, opacity: 0 })
      .set(cellRef.current, { backgroundColor: 'transparent' })
      .to(cursorRef.current, { opacity: 1, duration: 0.3 })
      .to(cursorRef.current, { x: 42, y: 35, duration: 1, ease: 'power2.inOut' })
      .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
      .to(cellRef.current, { backgroundColor: 'rgba(230, 194, 128, 0.2)', borderColor: 'rgba(230, 194, 128, 0.5)', duration: 0.2 })
      .to(cursorRef.current, { scale: 1, duration: 0.1 })
      .to(cursorRef.current, { x: 200, y: 150, duration: 1, ease: 'power2.inOut' })
      .to(cursorRef.current, { opacity: 0, duration: 0.3 });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-48 w-full overflow-hidden rounded-2xl border border-obsidian-700 bg-obsidian-800 p-6 shadow-2xl flex flex-col">
      <div className="text-xs font-mono text-champagne-600/70 mb-4 tracking-wider">SPRINTS & STANDUPS</div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-mono text-slate-500 mb-2">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1 relative">
        {Array.from({ length: 14 }).map((_, i) => (
          <div 
            key={i} 
            ref={i === 9 ? cellRef : null}
            className={`rounded-md border border-obsidian-700 bg-obsidian-900/40 ${i === 9 ? 'transition-colors' : ''}`}
          ></div>
        ))}
        {/* Cursor */}
        <div ref={cursorRef} className="absolute z-10 drop-shadow-lg w-4 h-4 text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1" className="w-5 h-5 -rotate-12">
            <path d="M5.5 2 L19 12 L11 13 L15 21 L12 22 L8 14 L2 16 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Feature Card: Shuffler (Model-Agnostic)
// -----------------------------------------------------
function FeatureShuffler() {
  const [models, setModels] = useState(['Claude 3.5', 'GPT-4o', 'Llama 3 Local']);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setModels(prev => {
        const _m = [...prev];
        _m.unshift(_m.pop()!);
        return _m;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-obsidian-700 bg-obsidian-800 p-6 shadow-2xl">
      <div className="mb-4 text-xs font-mono text-champagne-600/70 tracking-wider">MODEL REGISTRY</div>
      <div className="relative h-24 w-full perspective-[1000px]">
        {models.map((model, i) => {
          const isTop = i === 0;
          return (
            <div
              key={model}
              className={`absolute left-0 right-0 rounded-xl border p-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isTop 
                  ? 'border-champagne-500/30 bg-champagne-500/10 z-30 translate-y-0 scale-100 opacity-100 shadow-[0_8px_16px_rgba(230,194,128,0.1)]' 
                  : i === 1
                  ? 'border-obsidian-700 bg-obsidian-900/50 z-20 translate-y-4 scale-95 opacity-60'
                  : 'border-obsidian-700 bg-obsidian-900/30 z-10 translate-y-8 scale-90 opacity-20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium text-sm ${isTop ? 'text-champagne-500' : 'text-slate-400'}`}>{model}</span>
                {isTop && <Check className="h-4 w-4 text-champagne-500" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Feature Card: Billing (Margin Tracking)
// -----------------------------------------------------
function FeatureBilling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const costRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(costRef.current, 
      { innerHTML: "0" },
      {
        innerHTML: "4250",
        duration: 2.5,
        snap: { innerHTML: 1 },
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        },
        onUpdate: function() {
          if (costRef.current) {
            costRef.current.innerHTML = Number(Math.round(this.targets()[0].innerHTML)).toLocaleString();
          }
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-48 w-full overflow-hidden rounded-2xl border border-obsidian-700 bg-obsidian-800 p-6 shadow-2xl flex flex-col justify-center items-center group">
      <div className="absolute top-6 left-6 text-xs font-mono text-champagne-600/70 tracking-wider">MARGIN TRACKING</div>
      <div className="flex items-baseline gap-1 mt-4">
        <span className="text-2xl text-slate-500 font-serif">$</span>
        <span ref={costRef} className="text-6xl font-serif text-white group-hover:text-champagne-500 transition-colors">0</span>
      </div>
      <div className="mt-2 text-xs font-mono text-emerald-500/80 bg-emerald-500/10 px-2 py-1 rounded-full">
        +34% ROI THIS MONTH
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Component C: FEATURES
// -----------------------------------------------------
function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.feature-col', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <section id="features" ref={containerRef} className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Col 1 */}
        <div className="feature-col flex flex-col gap-6">
          <FeatureScheduler />
          <div>
            <h3 className="text-xl font-serif text-white mb-2">Engineering Swarms</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-light">
              Agent teams that run sprints, standups, and retrospectives like real engineering teams.
            </p>
          </div>
        </div>

        {/* Col 2 */}
        <div className="feature-col flex flex-col gap-6">
          <FeatureShuffler />
          <div>
            <h3 className="text-xl font-serif text-white mb-2">Model-Agnostic</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-light">
              Plug in any provider, prioritize free tiers, and swap intelligence sources without rewriting your agents.
            </p>
          </div>
        </div>

        {/* Col 3 */}
        <div className="feature-col flex flex-col gap-6">
          <FeatureBilling />
          <div>
            <h3 className="text-xl font-serif text-white mb-2">Built-in Billing</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-light">
              Run operations for clients and track margin. See your exact profit and token burn on every workspace.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

// -----------------------------------------------------
// Component D: PHILOSOPHY
// -----------------------------------------------------
function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.to('.parallax-bg', {
      y: '20%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.from('.phil-text', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative py-48 overflow-hidden bg-obsidian-900 border-y border-obsidian-800">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Server infrastructure"
          className="parallax-bg h-[120%] w-full object-cover opacity-10 mix-blend-screen grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-900 via-transparent to-obsidian-900" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center">
        <p className="phil-text text-xl md:text-2xl text-slate-400 mb-6 font-light tracking-tight">
          Most agent frameworks focus on scripts and terminal logs.
        </p>
        <p className="phil-text text-4xl md:text-5xl lg:text-7xl font-sans tracking-tight text-white flex flex-col items-center gap-2">
          <span className="font-serif">We focus on</span>
          <span className="italic text-champagne-500 mt-2 font-serif">
            production orchestration.
          </span>
        </p>
      </div>
    </section>
  );
}

// -----------------------------------------------------
// Component E: PROTOCOL (Sticky Stacking)
// -----------------------------------------------------
const PROTOCOL_STEPS = [
  {
    num: "01",
    title: "Deploy",
    desc: "Define your agent swarm. Abstract models into unified multi-tenant workspaces.",
    graphic: (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 border border-champagne-500/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
        <div className="w-48 h-48 border border-champagne-500/30 rounded-full flex items-center justify-center border-dashed">
          <div className="w-32 h-32 bg-champagne-500/10 rounded-full blur-xl"></div>
        </div>
      </div>
    )
  },
  {
    num: "02",
    title: "Orchestrate",
    desc: "Manage sprints and human approvals via an integrated task board and scheduler.",
    graphic: (
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-48 border border-obsidian-700/80 rounded-xl overflow-hidden bg-obsidian-800">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(230,194,128,0.2)_50%,transparent_100%)] h-[10px] w-full animate-[scan_3s_linear_infinite]" style={{ animationName: 'spin' }} />
        <div className="w-full h-full flex flex-col gap-2 p-4">
          <div className="h-4 w-3/4 rounded bg-obsidian-700"></div>
          <div className="h-4 w-1/2 rounded bg-obsidian-700"></div>
          <div className="h-4 w-5/6 rounded bg-obsidian-700"></div>
        </div>
      </div>
    )
  },
  {
    num: "03",
    title: "Observe",
    desc: "Scale compute, monitor costs, and analyze exact token traces in real-time.",
    graphic: (
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-32 flex items-center justify-center">
        <svg viewBox="0 0 200 100" className="w-full h-full stroke-champagne-500 fill-none" strokeWidth="2">
          <path d="M0,50 L40,50 L50,20 L60,80 L70,50 L200,50" className="opacity-30" />
          <path d="M0,50 L40,50 L50,20 L60,80 L70,50 L200,50" strokeDasharray="300" strokeDashoffset="300" style={{ animation: 'dash 3s linear infinite' }} />
        </svg>
        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    )
  }
];

function Protocol() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards: HTMLElement[] = gsap.utils.toArray('.protocol-card');
    
    cards.forEach((card: HTMLElement, index: number) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top top+=100",
        endTrigger: containerRef.current,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
        scrub: 1,
      });

      if (index > 0) {
        gsap.to(cards[index - 1], {
          scale: 0.9,
          opacity: 0.3,
          filter: "blur(10px)",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top top+=100",
            scrub: 1,
          }
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section id="protocol" ref={containerRef} className="relative py-32 bg-obsidian-900 border-t border-obsidian-800">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-sm font-mono text-champagne-600 mb-4 tracking-widest">PROTOCOL</h2>
          <p className="text-3xl lg:text-5xl font-serif text-white">The Swarm Operation Model</p>
        </div>

        <div className="relative pb-[50vh]">
          {PROTOCOL_STEPS.map((step, i) => (
            <div 
              key={step.num}
              className={`protocol-card relative w-full h-[60vh] max-h-[500px] mb-8 bg-obsidian-800 border border-obsidian-700 rounded-[2rem] p-12 overflow-hidden shadow-2xl flex items-center z-[${i*10}]`}
            >
              <div className="w-1/2 relative z-10">
                <span className="font-serif italic text-6xl text-obsidian-700 mb-6 block">{step.num}</span>
                <h3 className="text-4xl font-serif text-white mb-4">{step.title}</h3>
                <p className="text-lg text-slate-400 leading-relaxed font-light max-w-sm">{step.desc}</p>
              </div>
              <div className="w-1/2 relative h-full hidden md:block">
                {step.graphic}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------
// Component F: PRICING
// -----------------------------------------------------
function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-3xl lg:text-5xl font-serif text-white mb-4">Pricing that scales with you</h2>
        <p className="text-slate-400 max-w-xl mx-auto font-light">No hidden fees. Full access to the orchestrator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        {/* Tier 1 */}
        <div className="flex flex-col rounded-[2rem] border border-obsidian-700 bg-obsidian-800/50 p-8 text-center">
          <h3 className="text-xl font-serif text-slate-200 mb-2">Starter</h3>
          <p className="text-4xl font-serif text-white mb-6">$0<span className="text-lg text-slate-500 font-sans">/mo</span></p>
          <ul className="text-sm text-slate-400 space-y-3 mb-8 text-left font-light">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> 1 Workspace</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Basic Models</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Community Support</li>
          </ul>
          <Link href="/signup" className="mt-auto block w-full rounded-full border border-obsidian-700 bg-transparent py-3 text-sm font-semibold text-white hover:bg-obsidian-800 transition-colors">Start Free</Link>
        </div>

        {/* Tier 2 (Pops) */}
        <div className="flex flex-col rounded-[2rem] border border-champagne-500/40 bg-[#141417] p-10 text-center relative shadow-[0_0_40px_rgba(230,194,128,0.1)] transform md:scale-105 z-10 pt-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-champagne-500 text-obsidian-900 text-xs font-bold px-3 py-1 rounded-b-lg tracking-wider">PREMIUM</div>
          <h3 className="text-xl font-serif text-champagne-400 mb-2">Pro</h3>
          <p className="text-4xl font-serif text-white mb-6">$49<span className="text-lg text-slate-500 font-sans">/mo</span></p>
          <ul className="text-sm text-slate-300 space-y-3 mb-8 text-left font-light">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Unlimited Workspaces</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Any Model Support</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Approval Workflows</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Margin Tracking</li>
          </ul>
          <Link href="/signup" className="mt-auto group relative overflow-hidden rounded-full bg-champagne-500 py-3 text-sm font-semibold text-obsidian-900 transition-transform hover:scale-[1.03]">
            <span className="absolute inset-0 bg-champagne-400 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10">Get Pro</span>
          </Link>
        </div>

        {/* Tier 3 */}
        <div className="flex flex-col rounded-[2rem] border border-obsidian-700 bg-obsidian-800/50 p-8 text-center">
          <h3 className="text-xl font-serif text-slate-200 mb-2">Enterprise</h3>
          <p className="text-4xl font-serif text-white mb-6">Custom</p>
          <ul className="text-sm text-slate-400 space-y-3 mb-8 text-left font-light">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Dedicated Compute</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> SLA Guaranteed</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-champagne-500" /> Account Manager</li>
          </ul>
          <Link href="/contact" className="mt-auto block w-full rounded-full border border-obsidian-700 bg-transparent py-3 text-sm font-semibold text-white hover:bg-obsidian-800 transition-colors">Contact Sales</Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------
// Component G: FOOTER
// -----------------------------------------------------
function Footer() {
  return (
    <footer className="mt-20 border-t border-obsidian-800 bg-obsidian-900 py-12 rounded-t-[4rem]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <Bot className="h-5 w-5 text-champagne-500 group-hover:scale-110 transition-transform" />
            <span className="font-serif text-lg text-white">Agent OS</span>
          </Link>
          <p className="text-sm text-slate-500 max-w-xs mb-8 font-light leading-relaxed">
            The operating system for AI-powered engineering teams. Deploy, orchestrate, and monitor swarms.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-obsidian-800 border border-obsidian-700">
            <div className="h-2 w-2 rounded-full bg-champagne-500 animate-[pulse_3s_ease-in-out_infinite]" />
            <span className="text-xs font-mono text-champagne-500/80 font-medium">All systems operational</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-serif text-slate-200 mb-4 text-sm font-semibold tracking-wide">Product</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-light">
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">Features</Link></li>
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">Workflows</Link></li>
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">Pricing</Link></li>
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">Changelog</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-serif text-slate-200 mb-4 text-sm font-semibold tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-light">
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">About</Link></li>
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">Legal</Link></li>
            <li><Link href="#" className="hover:text-champagne-500 transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-obsidian-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-light">
        <p>&copy; {new Date().getFullYear()} Agent OS Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-champagne-500 transition-colors font-mono">X/Twitter</Link>
          <Link href="#" className="hover:text-champagne-500 transition-colors font-mono">GitHub</Link>
          <Link href="#" className="hover:text-champagne-500 transition-colors font-mono">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}

// -----------------------------------------------------
// MAIN EXPORT
// -----------------------------------------------------
export default function CinematicLandingPage() {
  return (
    <div className="relative min-h-screen bg-obsidian-900 text-slate-100 selection:bg-champagne-500/30 selection:text-champagne-100 font-sans overflow-x-hidden">
      <NoiseOverlay />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Philosophy />
        <Protocol />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
