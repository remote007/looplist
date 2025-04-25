import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Here you would create a new user in your database
    // For example:
    // const hashedPassword = await hashPassword(password);
    // const user = await db.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //   },
    // });

    // For now, we'll just simulate a successful signup
    // Replace this with your actual user creation logic

    return NextResponse.json({
      user: {
        id: "1",
        name,
        email,
      },
      // You might want to return a token here
      token: "sample-jwt-token",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
