"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: React.ReactNode;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Trusted by founders and enterprises generating over $100M in annual revenue.",
  logos = [
    {
      id: "logo-1",
      description: "Astro",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/astro.svg",
      className: "h-7 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,90,0,0.4)] hover:saturate-100 transition-all duration-500",
    },
    {
      id: "logo-2",
      description: "Figma",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/figma.svg",
      className: "h-7 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:saturate-100 transition-all duration-500",
    },
    {
      id: "logo-3",
      description: "Next.js",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/nextjs-icon.svg",
      className: "h-7 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:saturate-100 transition-all duration-500",
    },
    {
      id: "logo-4",
      description: "React",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/react.svg",
      className: "h-7 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(0,238,255,0.4)] hover:saturate-100 transition-all duration-500",
    },
    {
      id: "logo-5",
      description: "GitHub",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/github-icon.svg",
      className: "h-7 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:saturate-100 transition-all duration-500",
    },
    {
      id: "logo-6",
      description: "Supabase",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/supabase-icon.svg",
      className: "h-8 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(0,255,100,0.4)] hover:saturate-100 transition-all duration-500",
    },
    {
      id: "logo-7",
      description: "Tailwind CSS",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/tailwindcss-icon.svg",
      className: "h-7 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(0,238,255,0.4)] hover:saturate-100 transition-all duration-500",
    },
    {
      id: "logo-8",
      description: "Vercel",
      image: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/vercel-icon.svg",
      className: "h-6 w-auto saturate-[0.8] opacity-70 hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:saturate-100 transition-all duration-500",
    },
  ],
  className,
}: Logos3Props) => {
  return (
    <div className={className}>
      <div className="container flex flex-col items-center text-center">
        <p className="text-sm font-medium text-white/60 mb-8 max-w-xl mx-auto">
          {heading}
        </p>
      </div>
      <div>
        <div className="relative mx-auto flex items-center justify-center">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 1.5 })]}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/3 justify-center pl-0 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="mx-6 flex shrink-0 items-center justify-center">
                    <div>
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export { Logos3 };
