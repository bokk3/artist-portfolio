import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

type Event = {
  id: number;
  date: string;
  venue: string;
  city: string;
  ticket_url: string;
  status: string;
};

export function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <Card
      className={`overflow-hidden glass-card hover-lift ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Date */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center min-w-[70px] p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-xs uppercase text-primary font-bold">
                {eventDate.toLocaleDateString("en-US", { month: "short" })}
              </div>
              <div className="text-2xl font-bold text-primary">
                {eventDate.getDate()}
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{event.venue}</h3>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span>{event.city}</span>
              </div>
              {event.status === "sold_out" && (
                <Badge variant="destructive">Sold Out</Badge>
              )}
              {event.status === "cancelled" && (
                <Badge variant="secondary">Cancelled</Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 md:items-end">
            {event.ticket_url && event.status === "upcoming" && (
              <a
                href={event.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full md:w-auto">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Get Tickets
                </Button>
              </a>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {eventDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
