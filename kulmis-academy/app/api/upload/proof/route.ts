import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") ?? formData.get("proof");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = file as Blob;
  const type = blob.type?.toLowerCase();
  if (!type || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "Only JPG and PNG images are allowed" },
      { status: 400 }
    );
  }
  if (blob.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image must be 2MB or smaller" },
      { status: 400 }
    );
  }

  const ext = type === "image/png" ? "png" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "proofs");
  const filepath = path.join(dir, filename);

  try {
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await blob.arrayBuffer());
    await writeFile(filepath, buffer);
  } catch (err) {
    console.error("[upload/proof]", err);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }

  const url = `/uploads/proofs/${filename}`;
  return NextResponse.json({ url });
}
