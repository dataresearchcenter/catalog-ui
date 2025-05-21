"use client";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CountryLabel from "~/components/CountryLabel";
import DatasetLastUpdated from "~/components/Dataset/DatasetLastUpdated";
import DatasetProperty from "~/components/Dataset/DatasetProperty";
import DatasetResources from "~/components/Dataset/DatasetResources";
import DatasetSectionItems from "~/components/Dataset/DatasetSectionItems";
import Tags from "~/components/Tags";
import { IDatasetTransformed } from "~/util/transformFTM";
import { capitalizeFirstLetter } from "~/util/util";

const DatasetSectionHeader = ({
  label,
  count,
}: {
  label: string;
  count?: number;
}) => {
  return (
    <Card
      size="sm"
      color="success"
      variant="soft"
      sx={{ borderRadius: 0, padding: "10px", marginBottom: "24px !important" }}
    >
      <Typography
        level="body-md"
        sx={{ textTransform: "capitalize", fontWeight: "bold" }}
      >
        {label}
        {!!count && <span style={{ fontWeight: "normal" }}> ({count})</span>}
      </Typography>
    </Card>
  );
};

const DatasetMetadataMain = ({ dataset }: { dataset: IDatasetTransformed }) => {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2} sx={{ marginLeft: "-8px !important" }}>
        <Grid xs={6}>
          <DatasetProperty
            label="entities"
            value={dataset.entityCount}
            type="number"
          />
        </Grid>
        <Grid xs={6}>
          <DatasetProperty
            label="category"
            value={dataset.category}
            type="string"
          />
        </Grid>
        <Grid xs={6}>
          <DatasetProperty
            label="frequency"
            value={dataset.frequency}
            type="frequency"
          />
        </Grid>
        <Grid xs={6}>
          <DatasetProperty
            label="type"
            value={capitalizeFirstLetter(dataset.contentType)}
            type="datatype"
          />
        </Grid>
        <Grid xs={6}>
          <DatasetProperty
            label="last updated"
            value={dataset.updatedAt}
            type="date"
          />
          <Box sx={{ paddingTop: "4px" }}>
            <DatasetLastUpdated datetime={dataset.updatedAt} />
          </Box>
        </Grid>
      </Grid>
      <Typography level="body-md">{dataset.summary}</Typography>
      <DatasetProperty label="slug" value={dataset.name} />
    </Stack>
  );
};

const DatasetMetadataEntities = ({
  dataset,
}: {
  dataset: IDatasetTransformed;
}) => {
  const { countries, entityTypes } = dataset;

  return (
    <Stack spacing={4}>
      {!!entityTypes && entityTypes.length > 0 && (
        <>
          <DatasetSectionHeader
            label="entity types"
            count={entityTypes.length}
          />
          <DatasetSectionItems
            items={entityTypes}
            renderLabel={(item) => (
              <Typography
                level="body-sm"
                sx={(theme) => ({ color: theme.vars.palette.common.black })}
              >
                {item.plural}
              </Typography>
            )}
          />
        </>
      )}
      {!!countries && countries.length > 0 && (
        <>
          <DatasetSectionHeader label="countries" count={countries.length} />
          <DatasetSectionItems
            items={countries}
            renderLabel={(item) => (
              <CountryLabel iso={item.code} label={item.label} />
            )}
          />
        </>
      )}
    </Stack>
  );
};

const DatasetMetadataSecondary = ({
  dataset,
}: {
  dataset: IDatasetTransformed;
}) => {
  const { publisher, maintainer } = dataset;

  return (
    <Stack spacing={3}>
      {publisher && (
        <>
          <DatasetSectionHeader label="publisher" />
          {publisher.url ? (
            <Link href={publisher.url} style={{ marginTop: "0" }}>
              {publisher.name}
            </Link>
          ) : (
            <Typography>{publisher.name}</Typography>
          )}
          {publisher.description && (
            <Typography
              level="body-sm"
              sx={(theme) => ({ color: theme.vars.palette.common.black })}
            >
              {publisher.description}
            </Typography>
          )}
          {publisher.country && (
            <CountryLabel
              iso={publisher.country}
              label={publisher.country_label}
            />
          )}
        </>
      )}

      {maintainer && (
        <>
          <DatasetSectionHeader label="maintainer" />
          {maintainer.url ? (
            <Link href={maintainer.url} style={{ marginTop: "0" }}>
              {maintainer.name}
            </Link>
          ) : (
            <Typography>{maintainer.name}</Typography>
          )}
          {maintainer.description && (
            <Typography
              level="body-sm"
              sx={(theme) => ({ color: theme.vars.palette.common.black })}
            >
              {maintainer.description}
            </Typography>
          )}
          {maintainer.country && (
            <CountryLabel
              iso={maintainer.country}
              label={maintainer.country_label}
            />
          )}
        </>
      )}
    </Stack>
  );
};

export default function DatasetScreen({
  dataset,
}: {
  dataset: IDatasetTransformed;
}) {
  return (
    <Box sx={{ padding: "5rem 0", maxWidth: "1400px", margin: "auto" }}>
      <Stack>
        <Box sx={{ paddingBottom: "2rem" }}>
          <Typography level="h2" sx={{ paddingBottom: "1rem" }}>
            {dataset.title || dataset.name}
          </Typography>
          <Tags items={dataset.tags} />
        </Box>
        <Grid container spacing={6}>
          <Grid xs={12} sm={6} md={5}>
            <DatasetMetadataMain dataset={dataset} />
          </Grid>
          <Grid xs={12} sm={6} md={3.5}>
            <DatasetMetadataEntities dataset={dataset} />
          </Grid>
          <Grid xs={12} sm={6} md={3.5}>
            <DatasetMetadataSecondary dataset={dataset} />
          </Grid>
        </Grid>
      </Stack>
      <Stack sx={{ paddingTop: 8 }}>
        <Typography level="h3">Use this data</Typography>
        {dataset.maintainer?.name === "OpenSanctions" && (
          <Typography level="body-md">
            <strong>{dataset.title || dataset.name}</strong> is a dataset
            provided by{" "}
            <Link href="https://opensanctions.org">OpenSanctions</Link>.
            According to{" "}
            <Link href="https://www.opensanctions.org/licensing/">
              their licensing
            </Link>
            , you can use this data if you are a civic activist or journalist.
            If you need this dataset for commercial use, please buy a license
            from OpenSanctions.
          </Typography>
        )}
        {dataset.alephUrl && (
          <>
            <Typography level="body-md">
              <strong>Search in the data</strong>
            </Typography>
            <Typography level="body-md">
              {dataset.title || dataset.name} is available to{" "}
              <Link href={dataset.alephUrl}>search in OpenAleph</Link>.
            </Typography>
          </>
        )}
        <Typography level="body-md">
          <strong>Cross-reference with your own data</strong>
        </Typography>
        <Typography level="body-md">
          To cross-reference this dataset with your own data, you need an
          exclusive instance of{" "}
          <Link href="https://openaleph.org">OpenAleph</Link>. We at the{" "}
          <Link href="https://dataresearchcenter.org">
            Data and Research Center
          </Link>{" "}
          provide managed instances on our own secure infrastructure.{" "}
          <Link href="https://openaleph.org/managed/">Learn more</Link> or{" "}
          <Link href="mailto:hi@dataresearchcenter.org">get in touch</Link>.
        </Typography>
        {!!dataset.resources?.length && (
          <>
            <Typography level="body-md">
              <strong>Get the raw data</strong>
            </Typography>
            <Typography level="body-md">
              Download the raw data in the{" "}
              <Link href="https://followthemoney.tech">FollowTheMoney</Link>{" "}
              format from these sources:
            </Typography>
            <DatasetResources dataset={dataset} />
          </>
        )}
      </Stack>
    </Box>
  );
}
