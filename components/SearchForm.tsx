import { useEffect, useState } from "react";
import Image from "next/image";
import Input from "@mui/joy/Input";
import iconSearch from "~/assets/icons/search.svg";
import { useStoreActions } from "~/components/Store";
import { useDebounce } from "~/util/util";

export default function SearchForm() {
  const { search } = useStoreActions();
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue);

  useEffect(() => {
    if (debouncedSearchValue.length > 3) {
      search(debouncedSearchValue);
    } else if (!debouncedSearchValue) {
      search("");
    }
  }, [debouncedSearchValue, search]);
  return (
    <Input
      color="neutral"
      variant="plain"
      size="sm"
      placeholder="Search in Datasets"
      value={searchValue}
      onChange={(event) => setSearchValue(event.target.value)}
      startDecorator={<Image src={iconSearch} alt="search icon" />}
      sx={{
        "--Input-focusedThickness": "0rem",
        background: "#fff",
        padding: "13px 18px",
        flexGrow: 1,
      }}
    />
  );
}
