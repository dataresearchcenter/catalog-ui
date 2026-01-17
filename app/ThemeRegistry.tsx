// https://mui.com/joy-ui/integrations/next-js-app-router/
"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { theme } from "@investigativedata/style";

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
interface IOptions {
  readonly key: "joy";
}

interface IThemeRegistry {
  readonly options: IOptions;
}

function createEmotionCache(options: IOptions) {
  // Only create cache on the client side
  if (typeof document === "undefined") {
    return null;
  }
  const cache = createCache(options);
  cache.compat = true;
  return cache;
}

export default function ThemeRegistry(
  props: React.PropsWithChildren<IThemeRegistry>,
) {
  const { options, children } = props;

  const [cacheState, setCacheState] = React.useState<{
    cache: ReturnType<typeof createCache> | null;
    flush: () => string[];
  }>(() => ({
    cache: null,
    flush: () => [],
  }));

  React.useEffect(() => {
    const cache = createEmotionCache(options);
    if (cache) {
      const prevInsert = cache.insert;
      let inserted: string[] = [];
      cache.insert = (...args) => {
        const serialized = args[1];
        if (cache.inserted[serialized.name] === undefined) {
          inserted.push(serialized.name);
        }
        return prevInsert(...args);
      };
      const flush = () => {
        const prevInserted = inserted;
        inserted = [];
        return prevInserted;
      };
      setCacheState({ cache, flush });
    }
  }, [options]);

  useServerInsertedHTML(() => {
    if (!cacheState.cache) return null;
    const names = cacheState.flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cacheState.cache.inserted[name];
    }
    return (
      <style
        key={cacheState.cache.key}
        data-emotion={`${cacheState.cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  // During SSR/prerendering, render children without CacheProvider
  if (!cacheState.cache) {
    return (
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    );
  }

  return (
    <CacheProvider value={cacheState.cache}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </CacheProvider>
  );
}
