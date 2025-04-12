"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { SiLinkedin } from "react-icons/si";
import { SiGithub } from "react-icons/si";
import { SiGmail } from "react-icons/si";

export default function Nav() {
  return (
    <div className="flex justify-center pt-4">
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap justify-center gap-y-2">
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/"
              aria-label="Home"
            >
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/about"
              aria-label="About"
            >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/books"
              aria-label="Books"
            >
              Books
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/interesting"
              aria-label="Interesting"
            >
              Interesting
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="mailto:benjamin.echols@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Email"
            >
              <SiGmail />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="https://linkedin.com/in/benechols"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
            >
              <SiLinkedin />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="https://github.com/bechols"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
            >
              <SiGithub />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
