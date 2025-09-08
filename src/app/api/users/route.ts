import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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

export async function GET() {
  try {
    // Check if we have a database connection
    if (!process.env.POSTGRES_URL || process.env.POSTGRES_URL === "your-supabase-connection-string-here") {
      // Fallback to default users if no database connection
      return NextResponse.json(defaultUsers);
    }

    // Get users from database
    const dbUsers = await db.select().from(users);
    
    // Merge default users with database users (avoid duplicates)
    const defaultUserIds = new Set(defaultUsers.map(u => u.id));
    const additionalUsers = dbUsers.filter(dbUser => !defaultUserIds.has(dbUser.id));
    
    const allUsers = [...defaultUsers, ...additionalUsers];
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to default users on error
    return NextResponse.json(defaultUsers);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, role, gender, keepShabbat } = body;

    // Check if we have a database connection
    if (!process.env.POSTGRES_URL || process.env.POSTGRES_URL === "your-supabase-connection-string-here") {
      // Fallback: return error if no database
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Create new user in database
    const newUser = await db.insert(users).values({
      id, 
      name, 
      role, 
      gender, 
      keepShabbat,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return NextResponse.json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, role, gender, keepShabbat } = body;

    // Check if we have a database connection
    if (!process.env.POSTGRES_URL || process.env.POSTGRES_URL === "your-supabase-connection-string-here") {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Update user in database
    const updatedUser = await db.update(users)
      .set({
        name,
        role,
        gender,
        keepShabbat,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json(updatedUser[0]);
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

    // Check if we have a database connection
    if (!process.env.POSTGRES_URL || process.env.POSTGRES_URL === "your-supabase-connection-string-here") {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Delete user from database
    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
