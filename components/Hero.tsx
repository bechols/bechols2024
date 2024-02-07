import Image from "next/image";
import { Button } from "./ui/button";
import { AspectRatio } from "./ui/aspect-ratio";
import { LibraryBig, Lightbulb, Rocket } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex gap-8 w-128">
      <div className="flex flex-col gap-4">
        <span className="text-xl font-bold">Ben Echols</span>
        <span className="text-lg">
          Trying to leave it better than I found it.
        </span>
        <Link href="/about">
          <Button variant="outline" className="w-full">
            {`Experience and how I like to work`}
            <Lightbulb className="pl-2" />
          </Button>
        </Link>
        <Link href="/books">
          <Button variant="outline" className="w-full">
            {`What I'm reading lately`}
            <LibraryBig className="pl-2" />
          </Button>
        </Link>
        <Link href="/interesting">
          <Button variant="outline" className="w-full">
            {`Some interesting stuff`}
            <Rocket className="pl-2" />
          </Button>
        </Link>
      </div>
      <div className="w-full min-w-96 max-w-2xl">
        <AspectRatio ratio={1.47} className="overflow-hidden">
          <Image
            src={"/ben_and_liz_point_lobos.jpeg"}
            alt="Ben with his favorite person."
            className="rounded object-cover max-w-2xl"
            fill
          />
        </AspectRatio>
      </div>
    </div>
  );
}
