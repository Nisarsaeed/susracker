import { NextResponse } from "next/server";
import Criminal from "../../../../models/Criminal";
import connectDB from "../../../../lib/dbConnect"

export async function DELETE(req, { params }) {
  try {
    const { id } = await params; 

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Example: Delete from MongoDB (adjust based on your ORM)
    const deleted = await Criminal.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Criminal not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete criminal" },
      { status: 500 }
    );
  }
}

// app/api/criminals/[id]/route.js
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await req.formData();

    const updates = {};

    const name = formData.get("name");
    const age = formData.get("age");
    const crimes = formData.getAll("crimes");
    const threat = formData.get("threat");
    const status = formData.get("status");
    const imageFile = formData.get("image");
    const lastSeenLocation = formData.get("last_seen_location");
    const lastSeenDate = formData.get("last_seen_date");

    if (name) updates.name = name;
    if (age) updates.age = age;
    if (crimes && crimes.length > 0) updates.crimes = crimes;
    if (threat) updates.threat = threat;
    if (status) updates.status = status;
    if (lastSeenLocation) updates.last_seen_location = lastSeenLocation;
    if (lastSeenDate) updates.last_seen_date = new Date(lastSeenDate);

    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64Image = `data:${imageFile.type};base64,${Buffer.from(buffer).toString("base64")}`;
      // Push image to images array
      updates.$push = { images: base64Image };
    }

    const updated = await Criminal.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return Response.json({ error: "Criminal not found" }, { status: 404 });
    }

    return Response.json({ 
      message: "Criminal updated successfully",
      criminal: updated 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating criminal:", error);
    return Response.json({ error: error.message || "Failed to update criminal" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const criminal = await Criminal.findById(id);
    if (!criminal) {
      return Response.json({ error: "Criminal not found" }, { status: 404 });
    }

    // Return the criminal data without the MongoDB _id field
    const { _id, ...criminalData } = criminal.toObject();
    return Response.json({ 
      ...criminalData,
      id: _id.toString() // Convert ObjectId to string
    });

  } catch (error) {
    console.error("Error fetching criminal:", error);
    return Response.json({ error: "Failed to fetch criminal" }, { status: 500 });
  }
}