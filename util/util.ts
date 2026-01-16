import { useEffect, useState } from "react";
import { TActiveFilters } from "./filterOptions";
import { IDatasetTransformed } from "./transformFTM";

export function capitalizeFirstLetter(str?: string | null) {
  if (!str) return "";
  const castStr = str.toString();
  return castStr.charAt(0).toUpperCase() + castStr.slice(1);
}

export function applyActiveFilters(
  items: IDatasetTransformed[],
  filters: TActiveFilters,
): IDatasetTransformed[] {
  let filteredItems = items;

  if (filters.contentType.length > 0) {
    filteredItems = filteredItems.filter(({ contentType }) =>
      filters.contentType.includes(contentType || ""),
    );
  }
  if (filters.frequency.length > 0) {
    filteredItems = filteredItems.filter(({ frequency }) =>
      filters.frequency.includes(frequency || ""),
    );
  }

  if (filters.tags.length > 0) {
    filteredItems = filteredItems.filter(({ tags }) =>
      filters.tags.some((t: string) => tags?.includes(t)),
    );
  }

  if (filters.countries.length > 0) {
    filteredItems = filteredItems.filter(({ countryCodes }) =>
      countryCodes && filters.countries.some((c: string) => countryCodes.has(c)),
    );
  }
  return filteredItems;
}

// https://usehooks.com/useDebounce/
export function useDebounce(value: string, delay = 250): string {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
