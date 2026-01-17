"use client";

import { PropsWithChildren, createContext, useEffect, useState } from "react";

const HEADER_COLLAPSE_SCROLLPOINT = 180;
export const HeaderScrollContext = createContext(false);

export default function PageContextWrapper({ children }: PropsWithChildren) {
  const [isCollapsed, setCollapsed] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > HEADER_COLLAPSE_SCROLLPOINT) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <HeaderScrollContext.Provider value={isCollapsed}>
      {children}
    </HeaderScrollContext.Provider>
  );
}
