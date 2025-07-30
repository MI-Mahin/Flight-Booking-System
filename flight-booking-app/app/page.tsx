"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Search } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { FlightCard } from "@/components/flight-card"
import { SearchFilters } from "@/components/search-filters"

interface Flight {
  id: string
  name: string
  airline: string
  departure: {
    airport: string
    city: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    date: string
  }
  duration: string
  price: number
  availableSeats: number
  totalSeats: number
  aircraft: string
}

export default function HomePage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [flights, setFlights] = useState<Flight[]>([])
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    departure: "",
    arrival: "",
    date: "",
    priceRange: "",
  })

  // Mock flight data - replace with actual API calls
  useEffect(() => {
    const mockFlights: Flight[] = [
      {
        id: "1",
        name: "AA101",
        airline: "American Airlines",
        departure: {
          airport: "JFK",
          city: "New York",
          time: "08:30",
          date: "2024-02-15",
        },
        arrival: {
          airport: "LAX",
          city: "Los Angeles",
          time: "11:45",
          date: "2024-02-15",
        },
        duration: "6h 15m",
        price: 299,
        availableSeats: 45,
        totalSeats: 180,
        aircraft: "Boeing 737",
      },
      {
        id: "2",
        name: "DL205",
        airline: "Delta Airlines",
        departure: {
          airport: "ORD",
          city: "Chicago",
          time: "14:20",
          date: "2024-02-15",
        },
        arrival: {
          airport: "MIA",
          city: "Miami",
          time: "18:10",
          date: "2024-02-15",
        },
        duration: "3h 50m",
        price: 189,
        availableSeats: 23,
        totalSeats: 160,
        aircraft: "Airbus A320",
      },
      {
        id: "3",
        name: "UA890",
        airline: "United Airlines",
        departure: {
          airport: "SFO",
          city: "San Francisco",
          time: "22:15",
          date: "2024-02-15",
        },
        arrival: {
          airport: "SEA",
          city: "Seattle",
          time: "00:45",
          date: "2024-02-16",
        },
        duration: "2h 30m",
        price: 149,
        availableSeats: 67,
        totalSeats: 140,
        aircraft: "Boeing 757",
      },
    ]

    setTimeout(() => {
      setFlights(mockFlights)
      setFilteredFlights(mockFlights)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter flights based on search and filters
  useEffect(() => {
    const filtered = flights.filter((flight) => {
      const matchesSearch =
        flight.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.departure.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.arrival.city.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDeparture =
        !filters.departure || flight.departure.city.toLowerCase().includes(filters.departure.toLowerCase())

      const matchesArrival =
        !filters.arrival || flight.arrival.city.toLowerCase().includes(filters.arrival.toLowerCase())

      const matchesDate = !filters.date || flight.departure.date === filters.date

      const matchesPrice =
        !filters.priceRange ||
        (filters.priceRange === "low" && flight.price < 200) ||
        (filters.priceRange === "medium" && flight.price >= 200 && flight.price < 400) ||
        (filters.priceRange === "high" && flight.price >= 400)

      return matchesSearch && matchesDeparture && matchesArrival && matchesDate && matchesPrice
    })

    setFilteredFlights(filtered)
  }, [flights, searchTerm, filters])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to SkyBook</CardTitle>
            <CardDescription>Your gateway to seamless flight booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">SkyBook</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search flights by name, airline, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Available Flights ({filteredFlights.length})</h2>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredFlights.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Plane className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
