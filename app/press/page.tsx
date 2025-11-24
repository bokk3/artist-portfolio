import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Image, FileText, Music } from "lucide-react";

export default function PressPage() {
  const downloads = [
    {
      title: "Official Biography",
      description: "Full artist biography and press release",
      icon: FileText,
      file: "/press/bio.pdf",
    },
    {
      title: "Press Photos",
      description: "High-resolution promotional images",
      icon: Image,
      file: "/press/photos.zip",
    },
    {
      title: "Logos & Assets",
      description: "Brand logos and visual assets",
      icon: Music,
      file: "/press/logos.zip",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Press Kit
          </h1>
          <p className="text-xl text-muted-foreground">
            Download official press materials, photos, and biographical
            information.
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          {downloads.map((item) => (
            <Card key={item.title} className="border-border/10">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-border/10">
          <CardHeader>
            <CardTitle>Press Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">General Inquiries</h3>
              <a
                href="mailto:press@artist.com"
                className="text-primary hover:underline"
              >
                press@artist.com
              </a>
            </div>
            <div>
              <h3 className="font-bold mb-1">Booking</h3>
              <a
                href="mailto:booking@artist.com"
                className="text-primary hover:underline"
              >
                booking@artist.com
              </a>
            </div>
            <div>
              <h3 className="font-bold mb-1">Management</h3>
              <p className="text-muted-foreground">Jane Doe</p>
              <a
                href="mailto:jane@management.com"
                className="text-primary hover:underline"
              >
                jane@management.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
