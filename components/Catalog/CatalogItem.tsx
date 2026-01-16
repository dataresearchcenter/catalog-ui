import { memo } from "react";
import NLink from "next/link";
import type { Theme } from "@mui/joy";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { IDatasetTransformed } from "~/util/transformFTM";
import { capitalizeFirstLetter } from "~/util/util";
import DatasetPropertyValue from "../Dataset/DatasetPropertyValue";
import Tags from "../Tags";
import CatalogItemDetails from "./CatalogItemDetails";

type CatalogItemProps = {
  item: IDatasetTransformed;
};

const DatasetLink = ({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) => (
  <NLink href={href} passHref legacyBehavior>
    <Link overlay underline="none" href={href} sx={{ textDecoration: "none" }}>
      {children}
    </Link>
  </NLink>
);

export default memo(function CatalogItem({ item }: CatalogItemProps) {
  return (
    <Card
      color="success"
      variant="soft"
      size="sm"
      sx={(theme) => ({
        padding: "0",
        border: `1px solid ${theme.vars.palette.success[600]}`,
        overflow: "hidden",
        transition: "box-shadow 200ms",
        "&:hover": {
          boxShadow: `4px 4px 0 0 ${theme.vars.palette.success[600]}`,
        },
      })}
    >
      <CardContent>
        <Stack sx={{ padding: "1rem" }} spacing="0.5rem">
          <DatasetPropertyValue
            displayValue={
              !!item.contentType
                ? capitalizeFirstLetter(item.contentType)
                : undefined
            }
            value={item.contentType}
            type="datatype"
            style={(theme: Theme) => ({
              marginBottom: "0.5rem",
              color: theme.vars.palette.common.black,
            })}
          />
          <DatasetLink href={`/${item.name}`}>
            <Typography level="body-md" sx={{ fontWeight: "bold" }}>
              {item.title || item.name}
            </Typography>
          </DatasetLink>
          <Tags items={item.tags} />
        </Stack>
        <CatalogItemDetails item={item} />
      </CardContent>
    </Card>
  );
});
