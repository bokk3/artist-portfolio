import db from "@/lib/db";
import { EventCard } from "@/components/event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

async function getEvents() {
  const stmt = db.prepare("SELECT * FROM events ORDER BY date ASC");
  return stmt.all() as any[];
}

export default async function TourPage() {
  const allEvents = await getEvents();
  const now = new Date();

  const upcomingEvents = allEvents.filter(
    (event) => new Date(event.date) >= now
  );
  const pastEvents = allEvents.filter((event) => new Date(event.date) < now);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
          Tour Dates
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          See where I'll be performing next and get your tickets.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <p>No upcoming events scheduled.</p>
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <p>No past events.</p>
            </div>
          ) : (
            pastEvents
              .reverse()
              .map((event) => <EventCard key={event.id} event={event} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
