import connectDB from "../../../../lib/dbConnect";
import Admin from "../../../../models/Admin";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    // Validation
    if (!email || !password || password.length < 6) {
      return Response.json(
        { message: 'Invalid input - password should be at least 6 characters' },
        { status: 422 }
      );
    }

    await connectDB();
    
    const existingUser = await Admin.findOne({ email });
    
    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 422 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user using Mongoose model
    const newAdmin = new Admin({
      email,
      password: hashedPassword
    });

    await newAdmin.save();

    return Response.json(
      { message: 'New Admin Registered' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the incoming request body
    const { newPassword } = await req.json();

    // Check if new password is provided
    if (!newPassword) {
      return Response.json(
        { message: 'New password is required' },
        { status: 400 }
      );
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the admin by hardcoded email and update the password
    const result = await Admin.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      { password: hashedPassword },
      { new: true }
    );

    if (!result) {
      return Response.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating password:', error);
    return Response.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}