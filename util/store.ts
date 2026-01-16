import Fuse from "fuse.js";
import { TFilterValueCounts } from "./catalogStats";
import { TActiveFilters, emptyFilters } from "./filterOptions";
import { IDatasetTransformed, TCountryNames } from "./transformFTM";
import { applyActiveFilters } from "./util";
import calculateCatalogStats from "./catalogStats";

type TSearchIndex = Fuse<IDatasetTransformed>;

export interface IState {
  readonly datasets: IDatasetTransformed[];
  readonly countryNames: TCountryNames;
  readonly searchIndex: TSearchIndex | null;
  readonly filteredDatasets: IDatasetTransformed[];
  readonly filterValueCounts: TFilterValueCounts;
  readonly activeFilters: TActiveFilters;
  readonly searchValue: string;
  readonly loading: boolean;
}

export interface IInitialState {
  readonly datasets: IDatasetTransformed[];
  readonly filterValueCounts: TFilterValueCounts;
  readonly countryNames: TCountryNames;
}

// Computed selectors
export const selectTotalCount = (state: IState) => state.datasets.length;
export const selectActiveCount = (state: IState) => state.filteredDatasets.length;
export const selectActiveFilterCount = (state: IState) =>
  Object.values(state.activeFilters).flat().length;

// Helper functions
const createSearchIndex = (datasets: IDatasetTransformed[]): TSearchIndex =>
  new Fuse(datasets, {
    threshold: 0,
    ignoreLocation: true,
    keys: ["title", "publisher.name", "maintainer.name"],
  });

const filterAndCalculateFacets = (
  datasets: IDatasetTransformed[],
  filters: TActiveFilters,
) => {
  const filteredDatasets = applyActiveFilters(datasets, filters);
  const filterValueCounts = calculateCatalogStats(filteredDatasets);
  return { filteredDatasets, filterValueCounts };
};

// Store factory
export function createStore(initial: IInitialState) {
  let state: IState = {
    datasets: initial.datasets,
    countryNames: initial.countryNames,
    searchIndex: null,
    filteredDatasets: initial.datasets,
    filterValueCounts: initial.filterValueCounts,
    activeFilters: emptyFilters,
    searchValue: "",
    loading: true,
  };

  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (partial: Partial<IState>) => {
    state = { ...state, ...partial };
    notify();
  };

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getSnapshot: () => state,

    getServerSnapshot: () => state,

    actions: {
      filter: (filters: TActiveFilters) => {
        const { filteredDatasets, filterValueCounts } = filterAndCalculateFacets(
          state.datasets,
          filters,
        );
        setState({
          activeFilters: filters,
          filteredDatasets,
          filterValueCounts,
          loading: false,
        });
      },

      search: (value: string) => {
        const searchIndex = state.searchIndex ?? createSearchIndex(state.datasets);

        let baseDatasets = state.datasets;
        if (value.length > 3) {
          baseDatasets = searchIndex.search(value).map((r) => r.item);
        }

        const { filteredDatasets, filterValueCounts } = filterAndCalculateFacets(
          baseDatasets,
          state.activeFilters,
        );

        setState({
          searchValue: value,
          searchIndex,
          filteredDatasets,
          filterValueCounts,
        });
      },
    },
  };
}

export type TStore = ReturnType<typeof createStore>;
export type TActions = TStore["actions"];
