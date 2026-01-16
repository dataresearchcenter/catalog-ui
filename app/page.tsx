import { Suspense } from "react";
import { ICatalog, getCatalog } from "@investigativedata/ftmq";
import Page from "~/components/Page";
import StoreContext from "~/components/Store";
import CatalogScreen from "~/screens/CatalogScreen";
import { CATALOG_URI } from "~/settings";
import calculateCatalogStats from "~/util/catalogStats";
import { getCountryNames, transformFTMCatalog } from "~/util/transformFTM";

const breadcrumbs = [
  {
    label: "Catalog",
  },
];

export const CACHE: RequestInit = { cache: "force-cache" };

export default async function CatalogPage() {
  const catalog = await getCatalog(CATALOG_URI, CACHE);
  const { datasets } = transformFTMCatalog(catalog as ICatalog);
  const filterValueCounts = calculateCatalogStats(datasets);
  const countryNames = getCountryNames(datasets);

  return (
    <Page crumbs={breadcrumbs} isRoot>
      <Suspense fallback={"loading..."}>
        <StoreContext
          datasets={datasets}
          countryNames={countryNames}
          filterValueCounts={filterValueCounts}
        >
          <CatalogScreen />
        </StoreContext>
      </Suspense>
    </Page>
  );
}
