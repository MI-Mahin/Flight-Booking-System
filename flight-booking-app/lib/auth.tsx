"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - replace with actual API call
    if (email === "johndoe@example.com" && password === "securePass123") {
      const adminUser: User = {
        id: "1",
        name: "John Doe",
        email: "johndoe@example.com",
        role: "admin",
      }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
    } else {
      // Mock regular user login
      const regularUser: User = {
        id: "2",
        name: email.split("@")[0],
        email,
        role: "user",
      }
      setUser(regularUser)
      localStorage.setItem("user", JSON.stringify(regularUser))
    }
  }

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - replace with actual API call
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "user",
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
