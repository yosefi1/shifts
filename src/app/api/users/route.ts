import { NextRequest, NextResponse } from 'next/server';

// Default users list - exactly like in MSG BOARD
const defaultUsers = [
  { id: "0", name: "מנהל", role: "manager", gender: "male", keepShabbat: true },
  { id: "8863762", name: "בן קורל", role: "worker", gender: "male", keepShabbat: true },
  { id: "8279948", name: "טל אדרי", role: "worker", gender: "male", keepShabbat: true },
  { id: "9033163", name: "ליאב אביסידריס", role: "worker", gender: "male", keepShabbat: true },
  { id: "8880935", name: "ליאל שקד", role: "worker", gender: "male", keepShabbat: true },
  { id: "8679277", name: "מאור יצחק קפון", role: "worker", gender: "male", keepShabbat: true },
  { id: "9192400", name: "מור לחמני", role: "worker", gender: "male", keepShabbat: true },
  { id: "9181564", name: "נויה חזן", role: "worker", gender: "female", keepShabbat: false },
  { id: "8379870", name: "סילנאט טזרה", role: "worker", gender: "female", keepShabbat: false },
  { id: "8783268", name: "סתיו גינה", role: "worker", gender: "male", keepShabbat: true },
  { id: "9113482", name: "עהד הזימה", role: "worker", gender: "male", keepShabbat: true },
  { id: "9113593", name: "עומרי סעד", role: "worker", gender: "male", keepShabbat: true },
  { id: "8801813", name: "קטרין בטקיס", role: "worker", gender: "female", keepShabbat: false },
  { id: "8573304", name: "רונן רזיאב", role: "worker", gender: "male", keepShabbat: true },
  { id: "5827572", name: "רפאל ניסן", role: "worker", gender: "male", keepShabbat: true },
  { id: "9147342", name: "רפאלה רזניקוב", role: "worker", gender: "female", keepShabbat: false },
  { id: "8798653", name: "שירן מוסרי", role: "worker", gender: "male", keepShabbat: true },
  { id: "9067567", name: "שרון סולימני", role: "worker", gender: "male", keepShabbat: true },
  { id: "8083576", name: "יקיר אלדד", role: "worker", gender: "male", keepShabbat: true }
];

// In-memory storage for new users (like in MSG BOARD)
let newUsers: any[] = [];

export async function GET() {
  try {
    // Always return default users + any new users added
    const allUsers = [...defaultUsers, ...newUsers];
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, role, gender, keepShabbat } = body;

    // Create new user object
    const newUser = { 
      id, 
      name, 
      role, 
      gender, 
      keepShabbat,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to in-memory storage
    newUsers.push(newUser);

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, role, gender, keepShabbat } = body;

    // Update user in memory
    const userToUpdate = [...defaultUsers, ...newUsers].find(user => user.id === id);
    if (userToUpdate) {
      userToUpdate.name = name;
      userToUpdate.role = role;
      userToUpdate.gender = gender;
      userToUpdate.keepShabbat = keepShabbat;
      userToUpdate.updatedAt = new Date();
    }

    return NextResponse.json(userToUpdate);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Remove from newUsers array
    newUsers = newUsers.filter(user => user.id !== id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
