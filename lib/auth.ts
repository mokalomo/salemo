import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export interface User {
  id: number
  email: string
  full_name: string
  role: "user" | "admin"
  phone?: string
}

export interface Session {
  id: number
  user_id: number
  session_token: string
  expires_at: Date
}

// Generate a random session token
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password with bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create a new session for a user
export async function createSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sql`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${userId}, ${sessionToken}, ${expiresAt})
  `

  const cookieStore = await cookies()
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return sessionToken
}

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return null
    }

    const sessions = await sql`
      SELECT s.*, u.id, u.email, u.full_name, u.role, u.phone
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${sessionToken}
      AND s.expires_at > NOW()
      LIMIT 1
    `

    if (sessions.length === 0) {
      return null
    }

    const session = sessions[0]
    return {
      id: session.id,
      email: session.email,
      full_name: session.full_name,
      role: session.role,
      phone: session.phone,
    }
  } catch (error) {
    console.error("[v0] Error getting current user:", error)
    return null
  }
}

// Delete session (logout)
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")?.value

  if (sessionToken) {
    await sql`
      DELETE FROM sessions
      WHERE session_token = ${sessionToken}
    `
  }

  cookieStore.delete("session")
}

// Sign up a new user
export async function signUp(email: string, password: string, fullName: string, phone?: string) {
  try {
    const passwordHash = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (email, password_hash, full_name, phone, role)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${phone || null}, 'user')
      RETURNING id, email, full_name, role, phone
    `

    if (result.length === 0) {
      throw new Error("Failed to create user")
    }

    const user = result[0]
    await createSession(user.id)

    return { success: true, user }
  } catch (error: any) {
    console.error("[v0] Sign up error:", error)
    if (error.message?.includes("duplicate key")) {
      return { success: false, error: "البريد الإلكتروني مستخدم بالفعل" }
    }
    return { success: false, error: "حدث خطأ أثناء التسجيل" }
  }
}

// Sign in a user
export async function signIn(email: string, password: string) {
  try {
    const users = await sql`
      SELECT id, email, password_hash, full_name, role, phone
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    if (users.length === 0) {
      return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }
    }

    const user = users[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }
    }

    await createSession(user.id)

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
      },
    }
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" }
  }
}
