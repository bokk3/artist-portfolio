import db from "@/lib/db";
import { GalleryGrid } from "@/components/gallery-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

async function getGalleryImages() {
  const stmt = db.prepare("SELECT * FROM gallery ORDER BY created_at DESC");
  return stmt.all() as any[];
}

export default async function GalleryPage() {
  const allImages = await getGalleryImages();

  const categories = ["all", "live", "studio", "press"];
  const imagesByCategory = categories.reduce((acc, cat) => {
    acc[cat] =
      cat === "all"
        ? allImages
        : allImages.filter((img) => img.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
          Gallery
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Behind the scenes, on stage, and in the studio.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="studio">Studio</TabsTrigger>
          <TabsTrigger value="press">Press</TabsTrigger>
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            {imagesByCategory[category].length === 0 ? (
              <div className="text-center text-muted-foreground py-20">
                <p>No images in this category yet.</p>
              </div>
            ) : (
              <GalleryGrid images={imagesByCategory[category]} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
