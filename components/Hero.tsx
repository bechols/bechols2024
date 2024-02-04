import Image from "next/image";
import { Button } from "./ui/button";
import { AspectRatio } from "./ui/aspect-ratio";
import { LibraryBig, Lightbulb } from "lucide-react";

// aspect 1.47

export default function Hero() {
  return (
    <div className="flex gap-8 w-128">
      <div className="flex flex-col gap-4">
        <span className="text-xl font-bold">Ben Echols</span>
        <span className="text-lg">
          Trying to leave it better than I found it
        </span>
        <Button variant="outline">
          About Me
          <Lightbulb className="pl-2" />
        </Button>
        <Button variant="outline">
          The world is so interesting!
          <LibraryBig className="pl-2" />
        </Button>
      </div>
      <div className="w-full min-w-96">
        <AspectRatio ratio={1.47} className="overflow-hidden">
          <Image
            src={"/ben_and_liz_point_lobos.jpeg"}
            alt="Ben with his favorite person."
            className="rounded object-cover"
            fill
          />
        </AspectRatio>
      </div>
    </div>
  );
}
