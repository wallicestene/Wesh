import Image, { type StaticImageData } from "next/image";

import apartments from "@/assets/apartments.png";
import craigslist from "@/assets/craigslist.png";
import hotpads from "@/assets/hotpads.png";

interface Platform {
  name: string;
  logo: StaticImageData;
}

const platforms: Platform[] = [
  { name: "HotPads", logo: hotpads },
  { name: "Apartments.com", logo: apartments },
  { name: "Craigslist", logo: craigslist },
];

export default function Platforms() {
  return (
    <section className="border-b border-border bg-card/35">
      <div className="container py-12 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium text-wesh-teal">
              Sources Wesh watches
            </p>

            <h2 className="mt-2 max-w-xl font-display text-2xl font-semibold leading-tight text-foreground md:text-3xl">
              Monitoring the places SF renters already check
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
              Wesh keeps an eye on rental activity from popular platforms, so
              your search can start from one place.
            </p>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-background/75 shadow-sm sm:grid-cols-3">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="group flex min-h-24 items-center justify-center gap-3 border-b border-border/80 px-5 py-4 transition-colors hover:bg-card sm:border-b-0 sm:border-r last:border-b-0 sm:last:border-r-0"
              >
                <div className="relative h-8 w-24 opacity-75 grayscale transition group-hover:opacity-100 group-hover:grayscale-0">
                  <Image
                    src={platform.logo}
                    alt={`${platform.name} logo`}
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>

                <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-wesh-pine">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
