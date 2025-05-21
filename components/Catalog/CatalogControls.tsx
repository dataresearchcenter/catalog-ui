import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { TFilterField } from "~/util/filterOptions";
import { useStoreState } from "~/util/store";
import FilterCount from "../Filter/FilterCount";
import FilterModal from "../Filter/FilterModal";
import FilterResultSummary from "../Filter/FilterResultSummary";
import Filters from "../Filter/Filters";
import SearchForm from "../SearchForm";

export default function CatalogControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalCount = useStoreState((state) => state.totalCount);
  const activeCount = useStoreState((state) => state.activeCount);
  const activeFilterCount = useStoreState((state) => state.activeFilterCount);
  const activeFilters = useStoreState((state) => state.activeFilters);
  const filterValueCounts = useStoreState((state) => state.filterValueCounts);

  const createQueryString = useCallback(
    (name: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!!value) {
        if (params.has(name, value)) {
          params.delete(name, value);
        } else {
          params.append(name, value);
        }
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  const toggleFilter = (field: TFilterField, value: string) => {
    router.push(pathname + "/?" + createQueryString(field, value));
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const clearFilterGroup = (field: TFilterField) => {
    router.push(pathname + "/?" + createQueryString(field));
  };

  const filtersComponentProps = {
    filters: activeFilters,
    filterValueCounts,
    toggleFilter,
    clearFilterGroup,
  };

  const resultSummary = (
    <FilterResultSummary active={activeCount} total={totalCount} />
  );

  return (
    <Stack gap={2}>
      {resultSummary}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <SearchForm />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <FilterCount
            value={activeFilterCount}
            onClear={clearFilters}
            withIcon
          />
          <FilterModal filterCount={activeFilterCount}>
            {resultSummary}
            <Filters {...filtersComponentProps} defaultExpanded={false} />
          </FilterModal>
        </Stack>
      </Stack>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Filters {...filtersComponentProps} defaultExpanded />
      </Box>
    </Stack>
  );
}
