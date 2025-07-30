"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Plane, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

export default function AdminPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    airline: "",
    departureAirport: "",
    departureCity: "",
    departureTime: "",
    departureDate: "",
    arrivalAirport: "",
    arrivalCity: "",
    arrivalTime: "",
    arrivalDate: "",
    duration: "",
    price: "",
    totalSeats: "",
    aircraft: "",
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }

    // Mock flight data - replace with actual API calls
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
    ]
    setFlights(mockFlights)
  }, [user, router])

  const resetForm = () => {
    setFormData({
      name: "",
      airline: "",
      departureAirport: "",
      departureCity: "",
      departureTime: "",
      departureDate: "",
      arrivalAirport: "",
      arrivalCity: "",
      arrivalTime: "",
      arrivalDate: "",
      duration: "",
      price: "",
      totalSeats: "",
      aircraft: "",
    })
  }

  const handleAddFlight = () => {
    const newFlight: Flight = {
      id: Date.now().toString(),
      name: formData.name,
      airline: formData.airline,
      departure: {
        airport: formData.departureAirport,
        city: formData.departureCity,
        time: formData.departureTime,
        date: formData.departureDate,
      },
      arrival: {
        airport: formData.arrivalAirport,
        city: formData.arrivalCity,
        time: formData.arrivalTime,
        date: formData.arrivalDate,
      },
      duration: formData.duration,
      price: Number.parseInt(formData.price),
      availableSeats: Number.parseInt(formData.totalSeats),
      totalSeats: Number.parseInt(formData.totalSeats),
      aircraft: formData.aircraft,
    }

    setFlights((prev) => [...prev, newFlight])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Flight added",
      description: "New flight has been successfully added.",
    })
  }

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight)
    setFormData({
      name: flight.name,
      airline: flight.airline,
      departureAirport: flight.departure.airport,
      departureCity: flight.departure.city,
      departureTime: flight.departure.time,
      departureDate: flight.departure.date,
      arrivalAirport: flight.arrival.airport,
      arrivalCity: flight.arrival.city,
      arrivalTime: flight.arrival.time,
      arrivalDate: flight.arrival.date,
      duration: flight.duration,
      price: flight.price.toString(),
      totalSeats: flight.totalSeats.toString(),
      aircraft: flight.aircraft,
    })
  }

  const handleUpdateFlight = () => {
    if (!editingFlight) return

    const updatedFlight: Flight = {
      ...editingFlight,
      name: formData.name,
      airline: formData.airline,
      departure: {
        airport: formData.departureAirport,
        city: formData.departureCity,
        time: formData.departureTime,
        date: formData.departureDate,
      },
      arrival: {
        airport: formData.arrivalAirport,
        city: formData.arrivalCity,
        time: formData.arrivalTime,
        date: formData.arrivalDate,
      },
      duration: formData.duration,
      price: Number.parseInt(formData.price),
      totalSeats: Number.parseInt(formData.totalSeats),
      aircraft: formData.aircraft,
    }

    setFlights((prev) => prev.map((f) => (f.id === editingFlight.id ? updatedFlight : f)))
    setEditingFlight(null)
    resetForm()
    toast({
      title: "Flight updated",
      description: "Flight information has been successfully updated.",
    })
  }

  const handleDeleteFlight = (flightId: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== flightId))
    toast({
      title: "Flight deleted",
      description: "Flight has been successfully removed.",
    })
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Flights
                </Button>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Flight Management</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Flight
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Flight</DialogTitle>
                <DialogDescription>Enter the flight details to add a new flight to the system.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Flight Number</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., AA101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airline">Airline</Label>
                  <Input
                    id="airline"
                    value={formData.airline}
                    onChange={(e) => setFormData((prev) => ({ ...prev, airline: e.target.value }))}
                    placeholder="e.g., American Airlines"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureAirport">Departure Airport</Label>
                  <Input
                    id="departureAirport"
                    value={formData.departureAirport}
                    onChange={(e) => setFormData((prev) => ({ ...prev, departureAirport: e.target.value }))}
                    placeholder="e.g., JFK"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureCity">Departure City</Label>
                  <Input
                    id="departureCity"
                    value={formData.departureCity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, departureCity: e.target.value }))}
                    placeholder="e.g., New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, departureTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport">Arrival Airport</Label>
                  <Input
                    id="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={(e) => setFormData((prev) => ({ ...prev, arrivalAirport: e.target.value }))}
                    placeholder="e.g., LAX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalCity">Arrival City</Label>
                  <Input
                    id="arrivalCity"
                    value={formData.arrivalCity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, arrivalCity: e.target.value }))}
                    placeholder="e.g., Los Angeles"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, arrivalTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Arrival Date</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, arrivalDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 6h 15m"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="299"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalSeats">Total Seats</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData((prev) => ({ ...prev, totalSeats: e.target.value }))}
                    placeholder="180"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aircraft">Aircraft</Label>
                  <Input
                    id="aircraft"
                    value={formData.aircraft}
                    onChange={(e) => setFormData((prev) => ({ ...prev, aircraft: e.target.value }))}
                    placeholder="e.g., Boeing 737"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFlight}>Add Flight</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Flights Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{flight.name}</div>
                        <div className="text-sm text-gray-500">{flight.airline}</div>
                        <div className="text-sm text-gray-500">{flight.aircraft}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {flight.departure.airport} ({flight.departure.city}) → {flight.arrival.airport} (
                        {flight.arrival.city})
                      </div>
                      <div className="text-sm text-gray-500">{flight.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {flight.departure.date} at {flight.departure.time}
                      </div>
                      <div className="text-sm text-gray-500">
                        Arrives: {flight.arrival.date} at {flight.arrival.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${flight.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {flight.availableSeats}/{flight.totalSeats}
                      </div>
                      <Badge variant={flight.availableSeats > 20 ? "default" : "destructive"}>
                        {flight.availableSeats > 20 ? "Available" : "Limited"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Dialog
                          open={editingFlight?.id === flight.id}
                          onOpenChange={(open) => !open && setEditingFlight(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditFlight(flight)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Flight</DialogTitle>
                              <DialogDescription>Update the flight details.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Flight Number</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-airline">Airline</Label>
                                <Input
                                  id="edit-airline"
                                  value={formData.airline}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, airline: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-departureAirport">Departure Airport</Label>
                                <Input
                                  id="edit-departureAirport"
                                  value={formData.departureAirport}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, departureAirport: e.target.value }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-departureCity">Departure City</Label>
                                <Input
                                  id="edit-departureCity"
                                  value={formData.departureCity}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, departureCity: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Price ($)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={formData.price}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-totalSeats">Total Seats</Label>
                                <Input
                                  id="edit-totalSeats"
                                  type="number"
                                  value={formData.totalSeats}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, totalSeats: e.target.value }))}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                              <Button variant="outline" onClick={() => setEditingFlight(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateFlight}>Update Flight</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFlight(flight.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
