import { memo } from "react";
import { Theme } from "@mui/joy";
import Checkbox from "@mui/joy/Checkbox";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import type { TFilterValueCount } from "~/util/catalogStats";
import { capitalizeFirstLetter } from "~/util/util";
import Count from "../Count";
import DatasetPropertyValue from "../Dataset/DatasetPropertyValue";

export type TFilterGroupItems = {
  type?: string;
  items: TFilterValueCount[];
  activeFilters: string[];
  onChange: (value: string) => void;
};

export default memo(function FilterGroupItems({
  items,
  activeFilters,
  onChange,
  type,
}: TFilterGroupItems) {
  return (
    <List>
      {items.map(({ value, label, count }) => (
        <ListItem key={value}>
          <Checkbox
            label={
              <DatasetPropertyValue
                displayValue={label || capitalizeFirstLetter(value)}
                value={value}
                type={type}
                style={(theme: Theme) => ({
                  color:
                    count > 0 ? theme.vars.palette.common.black : "inherit",
                })}
              />
            }
            variant="soft"
            color="neutral"
            checked={activeFilters.includes(value)}
            disabled={count === 0}
            onChange={() => onChange(value)}
            slotProps={{
              checkbox: {
                sx: (theme) => ({
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: theme.vars.palette.success[50],
                  },
                }),
              },
            }}
          />
          {count > 0 && <Count value={count} />}
        </ListItem>
      ))}
    </List>
  );
});
