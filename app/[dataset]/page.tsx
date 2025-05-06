import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDataset, getCatalog } from "@investigativedata/ftmq";
import Page from "~/components/Page";
import DatasetScreen from "~/screens/DatasetScreen";
import { CATALOG_URI } from "~/settings";
import { transformFTMDataset } from "~/util/transformFTM";

async function getDataset(name: string): Promise<IDataset> {
  const catalog = await getCatalog(CATALOG_URI);
  const dataset = catalog.datasets?.find((d) => d.name === name);
  if (!dataset) notFound();
  return dataset as IDataset;
}

type Params = { readonly dataset: string };

export async function generateMetadata(
  props: {
    params: Promise<Params>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const dataset = await getDataset(params.dataset);
  return {
    title: dataset.title,
    description: dataset.summary,
  };
}

export default async function DatasetPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const dataset = await getDataset(params.dataset);
  const datasetTransformed = transformFTMDataset(dataset);

  const breadcrumbs = [
    {
      label: "Back to Data Catalog",
      url: "/",
    },
  ];

  return (
    <Page crumbs={breadcrumbs}>
      <DatasetScreen dataset={datasetTransformed} />
    </Page>
  );
}

export async function generateStaticParams() {
  const catalog = await getCatalog(CATALOG_URI);
  if (catalog.datasets)
    return catalog.datasets.map(({ name }) => ({ dataset: name }));
  return [];
}
