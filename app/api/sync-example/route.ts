import { NextResponse } from "next/server"

// This is an example of how to properly sync frontend and backend APIs
export async function GET() {
  try {
    // Example of fetching data from your database
    // const data = await db.items.findMany();

    // For demonstration purposes, we'll return mock data
    const data = [
      { id: 1, title: "Task 1", completed: false },
      { id: 2, title: "Task 2", completed: true },
      { id: 3, title: "Task 3", completed: false },
    ]

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Example of creating a new item in your database
    // const newItem = await db.items.create({ data: body });

    // For demonstration purposes, we'll return the input with an ID
    const newItem = { id: Date.now(), ...body }

    return NextResponse.json({ data: newItem })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
