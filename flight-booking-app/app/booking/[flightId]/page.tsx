"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, MapPin, Plane, User, CreditCard } from "lucide-react"
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

export default function BookingPage({ params }: { params: { flightId: string } }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(true)
  const [reservationTime, setReservationTime] = useState(120) // 2 minutes in seconds
  const [isReserved, setIsReserved] = useState(false)
  const [bookingStep, setBookingStep] = useState(1) // 1: Reserve, 2: Details, 3: Payment
  const [passengerDetails, setPassengerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Mock flight data - replace with actual API call
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

    const foundFlight = mockFlights.find((f) => f.id === params.flightId)
    setFlight(foundFlight || null)
    setLoading(false)
  }, [params.flightId, user, router])

  // Countdown timer for reservation
  useEffect(() => {
    if (!isReserved) return

    const timer = setInterval(() => {
      setReservationTime((prev) => {
        if (prev <= 1) {
          setIsReserved(false)
          setBookingStep(1)
          toast({
            title: "Reservation expired",
            description: "Your seat reservation has expired. Please try again.",
            variant: "destructive",
          })
          return 120
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isReserved, toast])

  const handleReserveSeat = () => {
    setIsReserved(true)
    setBookingStep(2)
    setReservationTime(120)
    toast({
      title: "Seat reserved!",
      description: "You have 2 minutes to complete your booking.",
    })
  }

  const handlePassengerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBookingStep(3)
  }

  const handleConfirmBooking = () => {
    // Mock booking confirmation
    toast({
      title: "Booking confirmed!",
      description: `Your booking for flight ${flight?.name} has been confirmed.`,
    })
    router.push("/")
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Plane className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Flight not found</h3>
            <p className="text-gray-500 mb-4">The requested flight could not be found.</p>
            <Link href="/">
              <Button>Back to Flights</Button>
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Flights
                </Button>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Book Flight</h1>
            </div>
            {isReserved && (
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Time remaining: {formatTime(reservationTime)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Flight Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{flight.name}</CardTitle>
                    <CardDescription>
                      {flight.airline} • {flight.aircraft}
                    </CardDescription>
                  </div>
                  <Badge variant={flight.availableSeats > 20 ? "default" : "destructive"}>
                    {flight.availableSeats} seats left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      Departure
                    </div>
                    <div className="font-medium">
                      {flight.departure.city} ({flight.departure.airport})
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.departure.date} at {flight.departure.time}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      Arrival
                    </div>
                    <div className="font-medium">
                      {flight.arrival.city} ({flight.arrival.airport})
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.arrival.date} at {flight.arrival.time}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duration: {flight.duration}</span>
                    <span className="text-2xl font-bold text-blue-600">${flight.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Steps */}
            {bookingStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reserve Your Seat</CardTitle>
                  <CardDescription>
                    Click below to reserve a seat for 2 minutes while you complete your booking.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleReserveSeat} className="w-full" size="lg">
                    Reserve Seat Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {bookingStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Passenger Details
                  </CardTitle>
                  <CardDescription>Please provide passenger information for this booking.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePassengerDetailsSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={passengerDetails.firstName}
                          onChange={(e) => setPassengerDetails((prev) => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={passengerDetails.lastName}
                          onChange={(e) => setPassengerDetails((prev) => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={passengerDetails.email}
                        onChange={(e) => setPassengerDetails((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={passengerDetails.phone}
                        onChange={(e) => setPassengerDetails((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={passengerDetails.dateOfBirth}
                        onChange={(e) => setPassengerDetails((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {bookingStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>Complete your booking by providing payment details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <Button onClick={handleConfirmBooking} className="w-full" size="lg">
                      Confirm Booking - ${flight.price}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Flight</span>
                    <span>{flight.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Route</span>
                    <span>
                      {flight.departure.airport} → {flight.arrival.airport}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Date</span>
                    <span>{flight.departure.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Passenger</span>
                    <span>{user.name}</span>
                  </div>
                </div>

                {isReserved && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Reservation Status</span>
                      <Badge variant="secondary">Reserved</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Time remaining</span>
                        <span>{formatTime(reservationTime)}</span>
                      </div>
                      <Progress value={(reservationTime / 120) * 100} className="h-2" />
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${flight.price}</span>
                  </div>
                </div>

                {bookingStep === 1 && (
                  <div className="text-xs text-gray-500 text-center">
                    Reserve your seat to start the booking process
                  </div>
                )}

                {isReserved && bookingStep > 1 && (
                  <div className="text-xs text-green-600 text-center">
                    ✓ Seat reserved - Complete booking before timer expires
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
