"use client";

import { useState, useEffect, useRef } from "react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  course: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  course?: string;
}

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string; // e.g. "919876543210"
}

const COURSES = [
  "MBA – Master of Business Administration",
  "MCA – Master of Computer Applications",
  "BBA – Bachelor of Business Administration",
  "BCA – Bachelor of Computer Applications",
  "B.Com – Bachelor of Commerce",
  "M.Com – Master of Commerce",
  "MA – Master of Arts",
  "B.Sc – Bachelor of Science (IT)",
  "PGDM – Post Graduate Diploma in Management",
  "Ph.D – Doctor of Philosophy",
];

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function LeadFormModal({
  isOpen,
  onClose,
  whatsappNumber = "919999999999",
}: LeadFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    course: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (min 2 characters).";
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number (starts with 6–9).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.course) {
      newErrors.course = "Please select a course.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // 1. Save to MongoDB via API
    try {
      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "banner-cta", timestamp: new Date().toISOString() }),
      });
    } catch {
      // Non-blocking — proceed even if API fails
    }

    // 2. Meta Pixel "Lead" event
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: formData.course,
        content_category: "Admission Enquiry",
      });
    }

    // 3. WhatsApp redirect
    const message = `🎓 *New Admission Enquiry*\n\n👤 *Name:* ${formData.name}\n📞 *Phone:* +91${formData.phone}\n📧 *Email:* ${formData.email}\n📚 *Course:* ${formData.course}\n\n_Submitted via website_`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1200);

    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({ name: "", phone: "", email: "", course: "" });
      setErrors({});
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        className="relative w-full max-w-md"
        style={{
          transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        }}
      >
        {/* Card */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{ background: "#fff" }}
        >
          {/* Header stripe */}
          <div
            className="relative flex items-center justify-between px-6 py-4"
            style={{
              background: "linear-gradient(135deg, #003087 0%, #0052cc 100%)",
            }}
          >
            {/* Yellow accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ background: "#FFD700" }}
            />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#FFD700", letterSpacing: "0.15em" }}
              >
                Amity University Online
              </p>
              <h2
                className="text-xl font-black text-white leading-tight mt-0.5"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Get Admission Info
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.15)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {!submitted ? (
              <>
                <p
                  className="text-sm mb-5"
                  style={{ color: "#64748b" }}
                >
                  Fill in your details and our counsellor will reach out to you.
                  Limited seats — hurry!
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#003087" }}>
                      Full Name <span style={{ color: "#e53e3e" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        border: `1.5px solid ${errors.name ? "#e53e3e" : "#e2e8f0"}`,
                        background: errors.name ? "#fff5f5" : "#f8fafc",
                        color: "#1e293b",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1.5px solid #003087";
                        e.target.style.background = "#fff";
                        e.target.style.boxShadow = "0 0 0 3px rgba(0,48,135,0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1.5px solid ${errors.name ? "#e53e3e" : "#e2e8f0"}`;
                        e.target.style.background = errors.name ? "#fff5f5" : "#f8fafc";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    {errors.name && (
                      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#e53e3e" }}>
                        <span>⚠</span> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#003087" }}>
                      Phone Number <span style={{ color: "#e53e3e" }}>*</span>
                    </label>
                    <div className="flex">
                      <span
                        className="flex items-center px-3 rounded-l-xl text-sm font-semibold border-y border-l"
                        style={{ background: "#f1f5f9", borderColor: "#e2e8f0", color: "#475569" }}
                      >
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="flex-1 px-4 py-3 rounded-r-xl text-sm outline-none transition-all duration-200"
                        style={{
                          border: `1.5px solid ${errors.phone ? "#e53e3e" : "#e2e8f0"}`,
                          borderLeft: "none",
                          background: errors.phone ? "#fff5f5" : "#f8fafc",
                          color: "#1e293b",
                        }}
                        onFocus={(e) => {
                          e.target.style.border = "1.5px solid #003087";
                          e.target.style.borderLeft = "none";
                          e.target.style.background = "#fff";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0,48,135,0.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.border = `1.5px solid ${errors.phone ? "#e53e3e" : "#e2e8f0"}`;
                          e.target.style.borderLeft = "none";
                          e.target.style.background = errors.phone ? "#fff5f5" : "#f8fafc";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#e53e3e" }}>
                        <span>⚠</span> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#003087" }}>
                      Email Address <span style={{ color: "#e53e3e" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        border: `1.5px solid ${errors.email ? "#e53e3e" : "#e2e8f0"}`,
                        background: errors.email ? "#fff5f5" : "#f8fafc",
                        color: "#1e293b",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1.5px solid #003087";
                        e.target.style.background = "#fff";
                        e.target.style.boxShadow = "0 0 0 3px rgba(0,48,135,0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1.5px solid ${errors.email ? "#e53e3e" : "#e2e8f0"}`;
                        e.target.style.background = errors.email ? "#fff5f5" : "#f8fafc";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    {errors.email && (
                      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#e53e3e" }}>
                        <span>⚠</span> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#003087" }}>
                      Course Interested In <span style={{ color: "#e53e3e" }}>*</span>
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 cursor-pointer"
                      style={{
                        border: `1.5px solid ${errors.course ? "#e53e3e" : "#e2e8f0"}`,
                        background: errors.course ? "#fff5f5" : "#f8fafc",
                        color: formData.course ? "#1e293b" : "#94a3b8",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 14px center",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1.5px solid #003087";
                        e.target.style.background = "#fff";
                        e.target.style.boxShadow = "0 0 0 3px rgba(0,48,135,0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1.5px solid ${errors.course ? "#e53e3e" : "#e2e8f0"}`;
                        e.target.style.background = errors.course ? "#fff5f5" : "#f8fafc";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option value="">— Select a programme —</option>
                      {COURSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.course && (
                      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#e53e3e" }}>
                        <span>⚠</span> {errors.course}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 mt-2 relative overflow-hidden"
                    style={{
                      background: isSubmitting
                        ? "#94a3b8"
                        : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      color: isSubmitting ? "#fff" : "#003087",
                      boxShadow: isSubmitting
                        ? "none"
                        : "0 4px 20px rgba(255,215,0,0.5)",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 28px rgba(255,215,0,0.65)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isSubmitting
                        ? "none"
                        : "0 4px 20px rgba(255,215,0,0.5)";
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8c0 1.16.3 2.25.82 3.19L1.5 14.5l3.36-.82A6.5 6.5 0 108 1.5z" fill="#003087" />
                          <path d="M10.5 9.5c-.17-.08-1-.5-1.16-.55-.16-.06-.27-.08-.39.08s-.44.55-.54.67c-.1.11-.2.13-.37.04A4.6 4.6 0 016.9 8.4c-.25-.3-.35-.59-.07-.7.17-.06.28-.2.37-.32.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.34-.05-.1-.38-.93-.52-1.27-.14-.34-.28-.28-.38-.28h-.33c-.12 0-.3.04-.46.22s-.6.58-.6 1.42.62 1.65.7 1.77c.1.11 1.22 1.87 2.96 2.62 1.74.74 1.74.5 2.06.47.31-.03 1-.4 1.14-.8.14-.38.14-.7.1-.77-.05-.07-.17-.12-.34-.2z" fill="#FFD700" />
                        </svg>
                        Apply on WhatsApp
                      </span>
                    )}
                  </button>

                  <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
                    🔒 Your information is safe and will not be shared.
                  </p>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="py-6 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M7 16l6 6 12-12"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-black mb-2"
                  style={{ color: "#003087", fontFamily: "'Georgia', serif" }}
                >
                  Enquiry Submitted! 🎉
                </h3>
                <p className="text-sm" style={{ color: "#64748b" }}>
                  Opening WhatsApp with your details. Our counsellor will contact
                  you within 24 hours.
                </p>
                <div
                  className="mt-4 h-1 rounded-full overflow-hidden"
                  style={{ background: "#e2e8f0" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #22c55e, #16a34a)",
                      animation: "progress 3s linear forwards",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}