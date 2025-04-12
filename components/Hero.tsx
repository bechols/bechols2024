import Image from "next/image";
import { Button } from "./ui/button";
import { AspectRatio } from "./ui/aspect-ratio";
import { LibraryBig, Lightbulb, Rocket } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="flex flex-col gap-8 w-full lg:w-[45%]">
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">Ben Echols</span>
          <span className="text-xl">
            Trying to leave it better than I found it.
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Link href="/about" className="w-full">
            <Button variant="outline" className="w-full min-h-[3.5rem] px-6">
              <div className="flex justify-between items-center w-full gap-4">
                <span className="text-left">Experience and how I like to work</span>
                <Lightbulb className="h-6 w-6 flex-shrink-0" />
              </div>
            </Button>
          </Link>
          <Link href="/books" className="w-full">
            <Button variant="outline" className="w-full min-h-[3.5rem] px-6">
              <div className="flex justify-between items-center w-full gap-4">
                <span className="text-left">What I'm reading lately</span>
                <LibraryBig className="h-6 w-6 flex-shrink-0" />
              </div>
            </Button>
          </Link>
          <Link href="/interesting" className="w-full">
            <Button variant="outline" className="w-full min-h-[3.5rem] px-6">
              <div className="flex justify-between items-center w-full gap-4">
                <span className="text-left">Some interesting stuff</span>
                <Rocket className="h-6 w-6 flex-shrink-0" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-[55%] hidden sm:block">
        <AspectRatio ratio={1.47} className="overflow-hidden bg-muted">
          <Image
            src={"/ben_and_liz_point_lobos.webp"}
            alt="Ben with his favorite person."
            className="rounded-lg object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </AspectRatio>
      </div>
    </div>
  );
}
