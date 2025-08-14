import connectDB from "../../../lib/dbConnect";
import Criminal from "../../../models/Criminal";

export async function GET(req) {
  try {
    await connectDB();
    const criminals = await Criminal.find({});
    return Response.json(criminals, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name");
    const age = formData.get("age");
    const crimes = formData.getAll("crimes"); // Get ALL crimes as array
    const threat = formData.get("threat");
    const status = formData.get("status");
    const imageFile = formData.get("image");

    if (!name || !age || !crimes || crimes.length === 0 || !threat || !status || !imageFile) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // Convert image to Base64
    const buffer = await imageFile.arrayBuffer();
    const base64Image = `data:${imageFile.type};base64,${Buffer.from(buffer).toString("base64")}`;

    const newCriminal = new Criminal({ 
      name, 
      age, 
      crimes, 
      threat, 
      status, 
      image: base64Image 
    });

    await newCriminal.save();

    return Response.json({ 
      message: "Criminal added successfully",
      criminal: newCriminal 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error adding criminal:", error);
    return Response.json({ 
      error: error.message || "Failed to add criminal" 
    }, { status: 500 });
  }
}


