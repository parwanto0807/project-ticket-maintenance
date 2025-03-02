import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { put } from "@vercel/blob"; // Pastikan modul ini telah terinstal

export async function PUT(req: Request, { params }: { params: { ticketId: string } }) {
  try {
    const contentTypeHeader = req.headers.get("content-type") || "";
    let technicianId: string;
    let scheduledDate: string;
    let analisaDescription: string;
    let actionDescription: string;
    let actualCheckDate: string;
    let status: string;
    // let ticketImage1: File | null = null;
    let ticketImage2: File | null = null;
    let ticketImage3: File | null = null;

    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();
      technicianId = formData.get("technicianId") as string;
      scheduledDate = formData.get("scheduledDate") as string;
      analisaDescription = (formData.get("analisaDescription") as string) || "";
      actionDescription = (formData.get("actionDescription") as string) || "";
      actualCheckDate = formData.get("actualCheckDate") as string;
      status = formData.get("status") as string;

      // const image1 = formData.get("ticketImage1");
      const image2 = formData.get("ticketImage2");
      const image3 = formData.get("ticketImage3");

      // if (image1 && image1 instanceof Blob) {
      //   ticketImage1 = image1 as File;
      // }
      if (image2 && image2 instanceof Blob) {
        ticketImage2 = image2 as File;
      }
      if (image3 && image3 instanceof Blob) {
        ticketImage3 = image3 as File;
      }
    } else {
      const body = await req.json();
      technicianId = body.technicianId;
      scheduledDate = body.scheduledDate;
      analisaDescription = body.analisaDescription;
      actionDescription = body.actionDescription;
      actualCheckDate = body.actualCheckDate;
      status = body.status;
    }

    if (!technicianId || !scheduledDate) {
      return NextResponse.json(
        { message: "technicianId dan scheduledDate wajib diisi" },
        { status: 400 }
      );
    }

    // Membangun data untuk update
    const updateData: Record<string, unknown> = {
      technicianId,
      scheduledDate: new Date(scheduledDate),
      analisaDescription,
      actionDescription,
      status,
      actualCheckDate: actualCheckDate ? new Date(actualCheckDate) : null,
      updatedAt: new Date(),
    };

    // Jika file image tersedia, upload ke Vercel Blob dan simpan URL-nya
    // if (ticketImage1) {
    //   const imageUrl1 = await put(
    //     `/ticket/${params.ticketId}/ticketImage1.jpg`,
    //     ticketImage1,
    //     { access: "public" as const, contentType: ticketImage1.type }
    //   );
    //   updateData.ticketImage1 = imageUrl1.url;
    // }
    if (ticketImage2) {
      const imageUrl2 = await put(
        `/ticket/${params.ticketId}/ticketImage2.jpg`,
        ticketImage2,
        { access: "public" as const, contentType: ticketImage2.type }
      );
      updateData.ticketImage2 = imageUrl2.url;
    }
    if (ticketImage3) {
      const imageUrl3 = await put(
        `/ticket/${params.ticketId}/ticketImage3.jpg`,
        ticketImage3,
        { access: "public" as const, contentType: ticketImage3.type }
      );
      updateData.ticketImage3 = imageUrl3.url;
    }

    const updatedTicket = await db.ticketMaintenance.update({
      where: { id: params.ticketId },
      data: updateData,
    });
    console.log(updatedTicket);

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
