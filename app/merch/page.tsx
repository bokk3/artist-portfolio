import { MerchCard } from "@/components/merch-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { ShoppingBag } from "lucide-react";

// Mock Data
const products = [
  {
    id: "1",
    name: "Limited Edition Vinyl",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
    category: "Music",
    url: "#",
  },
  {
    id: "2",
    name: "Tour T-Shirt 2025",
    price: 30,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
    category: "Apparel",
    url: "#",
  },
  {
    id: "3",
    name: "Logo Hoodie",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    category: "Apparel",
    url: "#",
  },
  {
    id: "4",
    name: "Slipmat Set",
    price: 20,
    image:
      "https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    url: "#",
  },
  {
    id: "5",
    name: "Tote Bag",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    url: "#",
  },
  {
    id: "6",
    name: "Sticker Pack",
    price: 10,
    image:
      "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    url: "#",
  },
];

export const metadata = {
  title: "Merch Store | Artist Portfolio",
  description: "Official merchandise, vinyl, and apparel.",
};

export default function MerchPage() {
  return (
    <div className="min-h-screen pt-20">
      <SectionWrapper>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 text-primary">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Official Store
          </h1>
          <p className="text-muted-foreground text-lg">
            Support the music directly. Worldwide shipping available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <MerchCard key={product.id} product={product} />
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}
