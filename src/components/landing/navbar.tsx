"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Scroll listener
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500"
      style={{ padding: scrolled ? "12px 20px" : "0" }}
    >
      <header
        className="w-full transition-all duration-500"
        style={{
          maxWidth: scrolled ? "800px" : "100%",
          borderRadius: scrolled ? "16px" : "0",
          borderBottom: scrolled ? "none" : "1px solid rgba(0,0,0,0.06)",
          background: scrolled
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.96)",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "blur(8px)",
          boxShadow: scrolled
            ? "0 2px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)"
            : "none",
        }}
      >
        <div
          className="mx-auto flex items-center justify-between transition-all duration-500"
          style={{
            height: scrolled ? "52px" : "62px",
            padding: scrolled ? "0 22px" : "0 28px",
            maxWidth: "1024px",
          }}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div
              className="flex items-center justify-center bg-indigo-600 transition-all duration-300 group-hover:bg-indigo-500"
              style={{
                height: "28px",
                width: "28px",
                borderRadius: scrolled ? "10px" : "8px",
              }}
            >
              <Zap size={13} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 font-poppins">
              MilestoneHit
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#how" className="nav-link">
              How it works
            </a>
            <a href="#trust" className="nav-link">
              Security
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
          </nav>

          {/* CTAs — changes based on auth state */}
          <div className="flex items-center gap-2">
            {loggedIn ? (
              <Link
                href="/dashboard"
                className="btn-primary flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="nav-link hidden sm:block px-1">
                  Sign in
                </Link>
                <Link href="/login" className="btn-primary">
                  Start tracking free
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
