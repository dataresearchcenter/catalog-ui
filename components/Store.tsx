"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useRef,
} from "react";
import {
  createStore,
  IInitialState,
  IState,
  TStore,
  TActions,
  selectTotalCount,
  selectActiveCount,
  selectActiveFilterCount,
} from "~/util/store";

const StoreCtx = createContext<TStore | null>(null);

export default function StoreContext({
  datasets,
  countryNames,
  filterValueCounts,
  children,
}: React.PropsWithChildren<IInitialState>) {
  // Create store once and keep stable reference
  const storeRef = useRef<TStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createStore({ datasets, countryNames, filterValueCounts });
  }

  return (
    <StoreCtx.Provider value={storeRef.current}>
      {children}
    </StoreCtx.Provider>
  );
}

function useStore() {
  const store = useContext(StoreCtx);
  if (!store) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return store;
}

// Main hook - only re-renders when selected value changes
export function useStoreState<T>(selector: (state: IState) => T): T {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getSnapshot()),
    () => selector(store.getServerSnapshot()),
  );
}

export function useStoreActions(): TActions {
  const store = useStore();
  return store.actions;
}

// Convenience hooks
export const useTotalCount = () => useStoreState(selectTotalCount);
export const useActiveCount = () => useStoreState(selectActiveCount);
export const useActiveFilterCount = () => useStoreState(selectActiveFilterCount);
