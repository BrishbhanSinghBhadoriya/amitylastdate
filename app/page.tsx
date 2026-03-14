// pages/index.tsx  (Pages Router)
// ─────────────────────────────────
// For App Router: app/page.tsx — just remove the default export wrapper
// and keep the JSX body.

import { Metadata } from "next";
import LeadGenerationBanner from "@/components/LeadGenerationBanner";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Amity University Online – Admissions Open",
  description: "Apply for online MBA, MCA, BBA and more at Amity University. Limited seats – admission closes March 25.",
};

export default function HomePage() {
  return (
    <>
      {/*
       * Meta Pixel – replace YOUR_PIXEL_ID with your actual ID.
       * Paste this snippet to enable fbq() calls in LeadFormModal.
       */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `,
        }}
      />

      <main className="min-h-screen bg-gray-50">
        {/*
         * ─── Drop the banner anywhere on your page ──────────────
         *
         * Props:
         *   imageSrc       – path to your banner image in /public
         *   whatsappNumber – your number in international format (no +)
         *   ctaLabel       – text on the CTA button
         *   urgencyText    – small badge above the button
         */}
        <LeadGenerationBanner
          imageSrc="/banner.png"           // ← place your image in /public
          whatsappNumber="919140901623"    // ← replace with your number
          ctaLabel="Enroll Now "

        />

    
        
      </main>
    </>
  );
}