import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "uploads/" });

    const files = blobs
      .map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt.toISOString(),
        name: blob.pathname.replace("uploads/", "").replace(/^\d+-/, ""),
      }))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

    return NextResponse.json({ files, total: files.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Studio] List uploads error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Accepted: JPEG, PNG, GIF, WebP, SVG" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 10MB" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const pathname = `uploads/${timestamp}-${safeName}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });

    const { blobs } = await list({ prefix: "uploads/" });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      totalFiles: blobs.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Studio] Upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get("pathname");

    if (!pathname) {
      return NextResponse.json(
        { error: "No pathname provided" },
        { status: 400 }
      );
    }

    await del(pathname);

    const { blobs } = await list({ prefix: "uploads/" });

    return NextResponse.json({ success: true, totalFiles: blobs.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Studio] Delete upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
