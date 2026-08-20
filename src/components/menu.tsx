"use client";

import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";

export type MenuLink = {
  href: string;
  label: string;
};

export type MenuAction = {
  action: string;
  label: string;
};

export type MenuItem = MenuLink | MenuAction;

type MenuProps = {
  label: string;
  links: MenuItem[];
};

function isLink(item: MenuItem): item is MenuLink {
  return "href" in item;
}

export function Menu({ label, links }: MenuProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const focusItem = useCallback((index: number) => {
    setActiveIndex(index);
    itemRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const lastIndex = links.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(activeIndex === lastIndex ? 0 : activeIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(activeIndex === 0 ? lastIndex : activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(lastIndex);
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
      {links.map((item, index) => {
        const key = isLink(item) ? item.href : item.action;
        const isActive = index === activeIndex;
        const sharedClassName =
          "group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none";
        const arrow = (
          <span
            aria-hidden="true"
            className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
          >
            {">"}
          </span>
        );

        return (
          <li key={key} role="none">
            {isLink(item) ? (
              <Link
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                href={item.href}
                role="menuitem"
                tabIndex={isActive ? 0 : -1}
                className={sharedClassName}
              >
                {arrow}
                <span>{item.label}</span>
              </Link>
            ) : (
              <form method="GET" action={item.action}>
                <button
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  type="submit"
                  role="menuitem"
                  tabIndex={isActive ? 0 : -1}
                  className={sharedClassName}
                >
                  {arrow}
                  <span>{item.label}</span>
                </button>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}
