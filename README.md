# 🎓 Amity University — Lead Generation Component

A production-ready, fully animated lead generation banner + modal for Next.js with:
- **WhatsApp auto-redirect** on form submission
- **MongoDB lead storage** via API route
- **Meta Pixel** `Lead` event tracking
- **Input validation** (phone format, required fields)
- **Success state** with auto-close

---

## 📁 File Structure

```
your-nextjs-project/
├── public/
│   └── banner.png                  ← Place your banner image here
│
├── components/
│   ├── LeadGenerationBanner.tsx    ← Main section: image + CTA button + trust bar
│   └── LeadFormModal.tsx           ← Animated popup form + WhatsApp + Meta Pixel
│
├── pages/
│   ├── index.tsx                   ← Example usage page
│   └── api/
│       └── save-lead.ts            ← MongoDB API endpoint (Pages Router)
│
│   ── OR (App Router) ──
│
└── app/
    ├── page.tsx                    ← Usage page
    └── api/
        └── save-lead/
            └── route.ts            ← Use the commented block in save-lead.ts
```

---

## 🚀 Quick Setup

### 1. Install dependencies

```bash
npm install mongodb
# next, react, react-dom, tailwindcss should already be installed
```

### 2. Add environment variables

Create `.env.local` in your project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/amity_leads?retryWrites=true&w=majority
```

### 3. Add your banner image

Place the promotional image at:
```
/public/banner.png
```

### 4. Update your WhatsApp number

In `pages/index.tsx` (or wherever you use the component):
```tsx
<LeadGenerationBanner
  imageSrc="/banner.png"
  whatsappNumber="919876543210"   // ← Your number, no + sign
/>
```

### 5. Set up Meta Pixel (optional)

Replace `YOUR_PIXEL_ID` in `pages/index.tsx` with your actual Facebook Pixel ID.
The `fbq('track', 'Lead')` call is already wired inside `LeadFormModal.tsx`.

---

## 🎛️ Component Props

### `<LeadGenerationBanner />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageSrc` | `string` | `"/banner.png"` | Banner image path (in /public) |
| `imageAlt` | `string` | `"..."` | Alt text for accessibility |
| `whatsappNumber` | `string` | `"919999999999"` | WhatsApp number (no + prefix) |
| `ctaLabel` | `string` | `"Apply Now — Free Counselling"` | CTA button text |
| `urgencyText` | `string` | `"⏰ Admission closes..."` | Badge above the button |

---

## 📱 WhatsApp Message Format

When the form is submitted, the following message is sent:

```
🎓 *New Admission Enquiry*

👤 *Name:* Rahul Sharma
📞 *Phone:* +919876543210
📧 *Email:* rahul@example.com
📚 *Course:* MBA – Master of Business Administration

_Submitted via website_
```

---

## 🗄️ MongoDB Document Schema

```json
{
  "_id": "ObjectId",
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "course": "MBA – Master of Business Administration",
  "source": "banner-cta",
  "createdAt": "2025-03-14T10:30:00.000Z",
  "ipAddress": "192.168.1.1"
}
```

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| Name | Required, minimum 2 characters |
| Phone | 10-digit Indian mobile number starting with 6–9 |
| Email | Valid email format |
| Course | Must select from dropdown |

---

## 🏗️ App Router Migration

If you're using the Next.js App Router, replace the API route by:

1. Delete `pages/api/save-lead.ts`
2. Create `app/api/save-lead/route.ts`
3. Paste the commented block from the bottom of `save-lead.ts`

Add `"use client"` to any component files as needed (already included).

---

## 🔐 Security Notes

- Server-side validation mirrors client-side validation
- IP address is captured for spam detection
- MongoDB connection is cached (singleton pattern) for performance
- No API keys are exposed to the client