import { checkEpkSession, logoutEpk } from "@/app/actions/epk";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionWrapper } from "@/components/section-wrapper";
import {
  Download,
  FileText,
  Music,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export default async function EpkPage() {
  const isAuthenticated = await checkEpkSession();

  if (!isAuthenticated) {
    redirect("/epk/login");
  }

  return (
    <div className="min-h-screen pt-20">
      <SectionWrapper>
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Electronic Press Kit
            </h1>
            <p className="text-muted-foreground">
              Official assets for press and promoters.
            </p>
          </div>
          <form action={logoutEpk}>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bio Section */}
          <div className="md:col-span-2 space-y-8">
            <Card className="p-8 glass-card">
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Biography
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="lead text-lg">
                  [Artist Name] is a visionary electronic music producer
                  redefining the boundaries of sound...
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Short Bio (PDF)
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Bio (PDF)
                </Button>
              </div>
            </Card>

            {/* Music Section */}
            <Card className="p-8 glass-card">
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                <Music className="w-6 h-6 text-primary" />
                Latest Music
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <Music className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">Unreleased Track {i}</p>
                        <p className="text-xs text-muted-foreground">
                          WAV • 44.1kHz • 24bit
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar Assets */}
          <div className="space-y-8">
            {/* Photos */}
            <Card className="p-6 glass-card">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Press Photos
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded overflow-hidden relative"
                  >
                    {/* Placeholder for images */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download All Photos (ZIP)
              </Button>
            </Card>

            {/* Tech Rider */}
            <Card className="p-6 glass-card">
              <h2 className="text-xl font-display font-bold mb-4">
                Tech Rider
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Technical requirements for live performances and DJ sets.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Tech Rider (PDF)
              </Button>
            </Card>

            {/* Logos */}
            <Card className="p-6 glass-card">
              <h2 className="text-xl font-display font-bold mb-4">Logos</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Vector and raster logo files (EPS, PNG, SVG).
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Logo Pack (ZIP)
              </Button>
            </Card>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
