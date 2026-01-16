import filterOptions, { TFilterField } from "./filterOptions";
import { IDatasetTransformed } from "./transformFTM";

export type TFilterValueCount = {
  value: string;
  label?: string;
  count: number;
};

export type TFilterValueCounts = {
  contentType: TFilterValueCount[];
  countries: TFilterValueCount[];
  frequency: TFilterValueCount[];
  tags: TFilterValueCount[];
};

const getFieldCounts = (items: IDatasetTransformed[], field: TFilterField) =>
  items
    .map((item) => item[field] as string)
    .reduce((acc: any, fieldValue: string) => {
      const existingCount: number = acc[fieldValue] || 0;
      return { ...acc, [fieldValue]: existingCount + 1 };
    }, {});

const getOrderedFieldCounts = (
  items: IDatasetTransformed[],
  field: TFilterField,
) => {
  const order = filterOptions.find((filterGroup) => filterGroup.field === field)
    ?.options;

  const counts = getFieldCounts(items, field);

  return (
    order?.map((value) => ({
      value,
      count: counts[value as keyof typeof counts] || 0,
    })) || []
  );
};

const getCountryCounts = (items: IDatasetTransformed[]) => {
  const countLookup: Record<string, TFilterValueCount> = {};

  for (const { countries } of items) {
    if (!countries) continue;
    for (const country of countries) {
      if (!country) continue;
      const existing = countLookup[country.code];
      if (existing) {
        existing.count += 1;
      } else {
        countLookup[country.code] = {
          value: country.code,
          label: country.label ?? undefined,
          count: 1,
        };
      }
    }
  }

  return Object.values(countLookup).sort((a, b) => b.count - a.count);
};

const getTags = (items: IDatasetTransformed[]) => {
  const tagsRaw = items
    .map(({ tags }) => tags)
    .flat()
    .filter((tag) => !!tag);

  return [...new Set(tagsRaw)].map((tag) => ({ value: tag, count: 0 }));
};

export default function calculateCatalogStats(
  datasets: IDatasetTransformed[],
): TFilterValueCounts {
  return {
    contentType: getOrderedFieldCounts(datasets, "contentType"),
    countries: getCountryCounts(datasets),
    frequency: getOrderedFieldCounts(datasets, "frequency"),
    tags: getTags(datasets) as TFilterValueCount[],
  };
}
