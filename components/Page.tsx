"use client";

import { useContext } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/joy/Box";
import type { TBreadrumb } from "./Breadcrumbs";
import Footer from "./Footer";
import Header from "./Header";
import PageContext, { HeaderScrollContext } from "./PageContext";

const ThemeRegistry = dynamic(() => import("~/app/ThemeRegistry"), {
  ssr: false,
});

type TPage = { crumbs: TBreadrumb[]; isRoot?: boolean };

export default function Page({
  crumbs,
  isRoot,
  children,
}: React.PropsWithChildren<TPage>) {
  const headerCollapsed = useContext(HeaderScrollContext);

  return (
    <ThemeRegistry options={{ key: "joy" }}>
      <PageContext>
        <Header crumbs={crumbs} isRoot={isRoot} />
        <Box
          component="main"
          sx={(theme) => ({
            paddingTop: headerCollapsed
              ? "var(--header-height-collapsed)"
              : {
                  xs: "var(--header-height-mobile)",
                  sm: "var(--header-height)",
                },
            paddingLeft: { xs: "1rem", sm: "2rem" },
            paddingRight: { xs: "1rem", sm: "2rem" },
            paddingBottom: "100px", // Footer
            backgroundColor: isRoot
              ? "inherit"
              : theme.vars.palette.success[50],
            transition: "var(--header-transition)",
          })}
        >
          {children}
        </Box>
        <Footer />
      </PageContext>
    </ThemeRegistry>
  );
}
