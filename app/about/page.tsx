import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Headphones, Sparkles, Award } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Years Active", value: "10+", icon: Music },
    { label: "Albums Released", value: "5", icon: Headphones },
    { label: "Collaborations", value: "50+", icon: Sparkles },
    { label: "Awards", value: "12", icon: Award },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
          About
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Producer, artist, and sonic architect pushing the boundaries of
          electronic music.
        </p>
      </div>

      {/* Bio Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {/* Replace with actual image */}
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Artist Photo
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-display font-bold">The Journey</h2>
          <div className="prose prose-invert prose-lg">
            <p className="text-muted-foreground leading-relaxed">
              From bedroom producer to international stages, the journey has
              been nothing short of extraordinary. With a passion for sound
              design and an ear for infectious melodies, every track tells a
              story.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Influenced by the pioneers of electronic music and the energy of
              underground rave culture, the sound is a fusion of cutting-edge
              production techniques and timeless musical emotion.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, the mission is clear: to create music that moves bodies,
              minds, and souls across the world.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/10 bg-card/50">
              <CardContent className="p-6 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Vision Section */}
      <div className="max-w-4xl mx-auto text-center glass-panel p-12 rounded-2xl">
        <h2 className="text-3xl font-display font-bold mb-6">Vision</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          To create sonic experiences that transcend genres and borders,
          bringing people together through the universal language of music.
        </p>
        <blockquote className="text-2xl font-display italic text-primary">
          "Music is not what I do, it's who I am."
        </blockquote>
      </div>
    </div>
  );
}
