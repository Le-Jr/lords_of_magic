"use client";

import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";

export type MenuLink = {
  href: string;
  label: string;
};

type MenuProps = {
  label: string;
  links: MenuLink[];
};

export function Menu({ label, links }: MenuProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const focusLink = useCallback((index: number) => {
    setActiveIndex(index);
    linkRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const lastIndex = links.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusLink(activeIndex === lastIndex ? 0 : activeIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusLink(activeIndex === 0 ? lastIndex : activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusLink(0);
        break;
      case "End":
        event.preventDefault();
        focusLink(lastIndex);
        break;
    }
  };

  return (
    <ul
      role="menu"
      aria-orientation="vertical"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-1"
    >
      {links.map((link, index) => (
        <li key={link.href} role="none">
          <Link
            ref={(node) => {
              linkRefs.current[index] = node;
            }}
            href={link.href}
            role="menuitem"
            tabIndex={index === activeIndex ? 0 : -1}
            className="group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
          >
            <span
              aria-hidden="true"
              className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
            >
              {">"}
            </span>
            <span>{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
