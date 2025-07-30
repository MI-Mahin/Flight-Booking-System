import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Plane } from "lucide-react"
import Link from "next/link"

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

interface FlightCardProps {
  flight: Flight
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{flight.name}</CardTitle>
            <CardDescription>{flight.airline}</CardDescription>
          </div>
          <Badge variant={flight.availableSeats > 20 ? "default" : "destructive"}>{flight.availableSeats} left</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              Departure
            </div>
            <div className="font-medium">{flight.departure.city}</div>
            <div className="text-sm text-gray-600">{flight.departure.time}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              Arrival
            </div>
            <div className="font-medium">{flight.arrival.city}</div>
            <div className="text-sm text-gray-600">{flight.arrival.time}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {flight.duration}
          </div>
          <div className="flex items-center">
            <Plane className="w-4 h-4 mr-1" />
            {flight.aircraft}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
          <Link href={`/booking/${flight.id}`}>
            <Button>Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
