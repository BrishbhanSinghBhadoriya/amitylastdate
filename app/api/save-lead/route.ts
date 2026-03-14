import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

// ─── MongoDB singleton ──────────────────────────────────────────
let cachedClient: MongoClient | null = null;

async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set.");

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  return client;
}

// ─── Lead schema ────────────────────────────────────────────────
interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  course: string;
  source?: string;
  timestamp?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;
    const { name, phone, email, course, source, timestamp } = body;

    // Basic server-side validation
    if (!name || !phone || !email || !course) {
      return NextResponse.json(
        { message: "Missing required fields: name, phone, email, course." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { message: "Invalid phone number format." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("amity_leads"); // change DB name as needed
    const collection = db.collection("enquiries");

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    const doc = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
      source: source ?? "website",
      createdAt: timestamp ? new Date(timestamp) : new Date(),
      ipAddress,
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        message: "Lead saved successfully.",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[save-lead] Error:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
