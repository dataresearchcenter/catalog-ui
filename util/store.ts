import {
  Action,
  Computed,
  Thunk,
  ThunkOn,
  action,
  computed,
  createTypedHooks,
  thunk,
  thunkOn,
} from "easy-peasy";
import Fuse from "fuse.js";
import calculateCatalogStats, { TFilterValueCounts } from "./catalogStats";
import {
  TActiveFilters,
  emptyFilterValueCounts,
  emptyFilters,
} from "./filterOptions";
import { IDatasetTransformed, TCountryNames } from "./transformFTM";
import { applyActiveFilters } from "./util";

type TSearchIndex = Fuse<IDatasetTransformed>;

export interface IInitialState {
  readonly datasets: IDatasetTransformed[];
  readonly filterValueCounts: TFilterValueCounts;
  readonly countryNames: TCountryNames;
}

interface IStore {
  readonly datasets: IDatasetTransformed[];
  readonly countryNames: TCountryNames;
  searchIndex: TSearchIndex | null;
  filteredDatasets: IDatasetTransformed[];
  filterValueCounts: TFilterValueCounts;
  activeFilters: TActiveFilters;
  loading: boolean;
  searchValue: string;

  totalCount: Computed<IStore, number>;
  activeCount: Computed<IStore, number>;
  activeFilterCount: Computed<IStore, number>;

  // public actions
  readonly filter: Action<IStore, TActiveFilters>;
  readonly search: Action<IStore, string>;

  // internal actions
  readonly setSearchIndex: Action<IStore, TSearchIndex>;
  readonly setFilteredDatasets: Action<IStore, IDatasetTransformed[]>;
  readonly setFilterValueCounts: Action<IStore, TFilterValueCounts>;

  // thunks
  readonly initializeSearchIndex: Thunk<IStore>;
  readonly handleSearch: Thunk<IStore, string>;
  readonly handleFilter: Thunk<IStore, TActiveFilters>;

  // listeners that trigger async actions
  readonly onSetActiveFilters: ThunkOn<IStore>;
  readonly onSetSearchValue: ThunkOn<IStore>;
}

const Store: IStore = {
  filteredDatasets: [],
  filterValueCounts: emptyFilterValueCounts,
  activeFilters: emptyFilters,
  datasets: [],
  countryNames: {},
  searchIndex: null,
  loading: true,
  searchValue: "",

  totalCount: computed((state) => state.datasets.length),
  activeCount: computed((state) => state.filteredDatasets.length),
  activeFilterCount: computed(
    (state) => Object.values(state.activeFilters).flat().length,
  ),

  // actions
  filter: action((state, payload) => {
    state.loading = true;
    state.activeFilters = payload;
  }),
  search: action((state, payload) => {
    state.loading = true;
    state.searchValue = payload;
  }),
  setSearchIndex: action((state, payload) => {
    state.searchIndex = payload;
    state.loading = false;
  }),
  setFilteredDatasets: action((state, payload) => {
    state.filteredDatasets = payload;
    state.loading = false;
  }),
  setFilterValueCounts: action((state, payload) => {
    state.filterValueCounts = payload;
    state.loading = false;
  }),

  // thunks
  initializeSearchIndex: thunk(async (actions, _, helpers) => {
    const { datasets } = helpers.getState();
    const searchIndex = await initializeSearchIndex(datasets);
    actions.setSearchIndex(searchIndex);
  }),
  handleSearch: thunk(async (actions, payload, helpers) => {
    let { searchIndex, activeFilters, datasets } = helpers.getState();
    if (payload.length > 3) {
      if (!searchIndex) {
        searchIndex = await initializeSearchIndex(datasets);
      }
      datasets = await filterDatasets(
        await searchDatasets(searchIndex, payload),
        activeFilters,
      );
      const filterValueCounts = await calculateFilterValueCounts(datasets);
      actions.setFilteredDatasets(datasets);
      actions.setFilterValueCounts(filterValueCounts);
    } else {
      actions.handleFilter(activeFilters);
    }
  }),
  handleFilter: thunk(async (actions, payload, helpers) => {
    const state = helpers.getState();
    const datasets = await filterDatasets(state.datasets, payload);
    const filterValueCounts = await calculateFilterValueCounts(datasets);
    actions.setFilteredDatasets(datasets);
    actions.setFilterValueCounts(filterValueCounts);
  }),

  // listeners
  onSetActiveFilters: thunkOn(
    (actions) => actions.filter,
    async (actions, target) => {
      const activeFilters = target.payload;
      actions.handleFilter(activeFilters);
    },
  ),
  onSetSearchValue: thunkOn(
    (actions) => actions.search,
    async (actions, target) => {
      const searchValue = target.payload;
      actions.handleSearch(searchValue);
    },
  ),
};

const initializeSearchIndex = async (
  datasets: IDatasetTransformed[],
): Promise<TSearchIndex> => {
  return Promise.resolve(
    new Fuse(datasets, {
      threshold: 0,
      ignoreLocation: true,
      keys: ["title", "publisher.name", "maintainer.name"],
    }),
  );
};

const searchDatasets = async (
  searchIndex: TSearchIndex,
  value: string,
): Promise<IDatasetTransformed[]> =>
  Promise.resolve(searchIndex.search(value).map((r) => r.item));

const filterDatasets = async (
  datasets: IDatasetTransformed[],
  filters: TActiveFilters,
): Promise<IDatasetTransformed[]> =>
  Promise.resolve(
    applyActiveFilters(datasets, filters).sort((a, b) =>
      a.updatedAt && (!b.updatedAt || a.updatedAt > b.updatedAt) ? -1 : 1,
    ),
  );

const calculateFilterValueCounts = async (
  datasets: IDatasetTransformed[],
): Promise<TFilterValueCounts> =>
  Promise.resolve(calculateCatalogStats(datasets));

export default Store;

const typedHooks = createTypedHooks<IStore>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
