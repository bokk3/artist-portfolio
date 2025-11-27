"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

interface MerchProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  url: string;
}

interface MerchCardProps {
  product: MerchProduct;
}

export function MerchCard({ product }: MerchCardProps) {
  return (
    <Card className="group overflow-hidden glass-card hover-lift">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <MagneticButton strength={0.2}>
            <Button
              size="lg"
              className="rounded-full font-bold"
              onClick={() => window.open(product.url, "_blank")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </MagneticButton>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
              {product.category}
            </p>
            <h3 className="font-display font-bold text-lg leading-tight">
              {product.name}
            </h3>
          </div>
          <span className="font-mono font-bold text-primary">
            ${product.price}
          </span>
        </div>
      </div>
    </Card>
  );
}
