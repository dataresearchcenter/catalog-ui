import {
  ICatalog,
  ICountry,
  IDataset,
  IMaintainer,
  IPublisher,
  ISchema,
  TContentType,
  TDatasetCategory,
  TDatasetFrequency,
} from "@investigativedata/ftmq";

export interface ICatalogTransformed {
  readonly datasets: IDatasetTransformedBase[];
}

export interface IDatasetTransformedBase {
  readonly alephUrl?: string | null;
  readonly category?: TDatasetCategory | string;
  readonly contentType?: TContentType | string | null;
  readonly countries?: ICountry[] | null;
  readonly entityCount?: number | null;
  readonly frequency?: TDatasetFrequency;
  readonly maintainer?: IMaintainer | null;
  readonly name: string;
  readonly publisher?: IPublisher | null;
  readonly tags?: string[] | null;
  readonly title?: string | null;
  readonly updatedAt?: string | null;
}

export interface IDatasetTransformed extends IDatasetTransformedBase {
  readonly summary?: string | null;
  readonly entityTypes?: ISchema[] | null;
}

export function transformFTMCatalog(catalog: ICatalog): ICatalogTransformed {
  return { datasets: catalog.datasets?.map(transformFTMDataset) || [] };
}

export function transformFTMDataset(
  dataset: IDataset & { tags?: string[] | null },
): IDatasetTransformed {
  const {
    aleph_url,
    category,
    content_type,
    coverage,
    entity_count,
    maintainer,
    name,
    publisher,
    summary,
    tags,
    title,
    updated_at,
  } = dataset;

  const things = dataset.things;
  const intervals = dataset.intervals;

  const schemataMerged = [
    ...(things?.schemata || []),
    ...(intervals?.schemata || []),
  ].sort((a, b) => (a.count > b.count ? -1 : 1));

  const countries: ICountry[] = [
    ...(things?.countries || []),
    ...(intervals?.countries || []),
  ];

  const countriesMerged = Object.values(
    countries.reduce((acc: any, item) => {
      acc[item.code] = acc[item.code]
        ? { ...item, count: item.count + acc[item.code].count }
        : item;
      return acc;
    }, {}),
  ).sort((a: any, b: any) => (a.count > b.count ? -1 : 1));

  return {
    alephUrl: aleph_url,
    category: category || "Other",
    contentType: content_type || "Structured",
    countries: countriesMerged as ICountry[],
    entityCount: entity_count,
    entityTypes: schemataMerged,
    frequency: coverage?.frequency,
    maintainer,
    name,
    publisher,
    summary,
    tags: tags || [],
    title,
    updatedAt: updated_at,
  };
}

export function dehydrateDataset(
  dataset: IDatasetTransformed,
): IDatasetTransformedBase {
  const { summary, entityTypes, ...rest } = dataset;
  return rest;
}

export type TCountryNames = {
  [key: string]: string;
};

export function getCountryNames(
  datasets: IDatasetTransformed[],
): TCountryNames {
  const names: TCountryNames = {};
  datasets.map(({ countries }) =>
    countries?.map((c) => {
      names[c.code] = c.label || c.code;
    }),
  );
  return names;
}
