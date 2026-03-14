"use client";

import { useState } from "react";
import Image from "next/image";
import LeadFormModal from "./LeadFormModal";

interface LeadGenerationBannerProps {
  /**
   * Path to the promotional banner image.
   * Place your image in /public folder and pass e.g. "/banner.png"
   */
  imageSrc?: string;
  imageAlt?: string;
  /** WhatsApp number in international format WITHOUT the '+', e.g. "919876543210" */
  whatsappNumber?: string;
  ctaLabel?: string;
  urgencyText?: string;
}

export default function LeadGenerationBanner({
  imageSrc = "/banner.png",
  imageAlt = "Amity University Online – Current Session Last Few Seats Left",
  whatsappNumber = "919140901623",
  ctaLabel = "Enroll Now ",

}: LeadGenerationBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* ─── Banner Section ─────────────────────────────────── */}
      <section className="w-full bg-white overflow-hidden" style={{ maxWidth: "100vw" }}>
        {/* 1. Full Image shown first */}
        <div className="w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1920}
            height={1080}
            priority
            className="w-full h-auto block"
            sizes="100vw"
          />
        </div>

        {/* 2. CTA Group – now below the image */}
        <div className="flex flex-col items-center justify-center gap-4 py-8 px-4 bg-gray-50">
          <div className="w-full max-w-xl mx-auto flex flex-col items-stretch gap-4">
            {/* Main CTA button - Full Width */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest overflow-hidden transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: "#003087",
                boxShadow: "0 10px 35px rgba(255,165,0,0.45)",
                letterSpacing: "0.12em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
                e.currentTarget.style.boxShadow = "0 18px 45px rgba(255,165,0,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 35px rgba(255,165,0,0.45)";
              }}
            >
              {/* Shine effect */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)",
                }}
              />

              {/* WhatsApp icon */}
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="relative z-10">
                <path d="M10 1.5C5.41 1.5 1.5 5.41 1.5 10c0 1.45.37 2.81 1.02 3.99L1.5 18.5l4.6-1.01A8.5 8.5 0 1010 1.5z" fill="#003087" />
                <path d="M13 11.5c-.2-.1-1.2-.6-1.38-.67-.18-.07-.32-.1-.46.1s-.52.67-.64.8c-.12.14-.24.15-.44.05A5.4 5.4 0 018.5 10.2c-.3-.35-.4-.7-.08-.83.2-.07.34-.23.44-.37.12-.15.16-.24.24-.4.07-.16.04-.3-.02-.42-.06-.12-.46-1.1-.63-1.5-.16-.4-.32-.35-.46-.35h-.4c-.14 0-.36.05-.55.26s-.72.7-.72 1.7.75 1.98.85 2.12c.12.14 1.46 2.23 3.54 3.13 2.08.9 2.08.6 2.46.56.37-.04 1.2-.48 1.36-.96.17-.48.17-.88.12-.96-.05-.08-.2-.13-.4-.22z" fill="#FFD700" />
              </svg>
              <span className="relative z-10">{ctaLabel}</span>

              {/* Arrow */}
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="relative z-10 transition-transform duration-200 group-hover:translate-x-1.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#003087" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Sub-note */}
          <p className="text-xs font-semibold mt-2" style={{ color: "#64748b" }}>
            🔒 No spam. Free counselling session with an expert.
          </p>
        </div>

        {/* Trust bar */}
        
      </section>

      {/* ─── Modal ──────────────────────────────────────────── */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}



 
