import Image from "next/image";
import Link from "next/link";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Box from "@mui/system/Box";
import logoSrc from "~/assets/DARC-Logo-RGB-Square-Triangle-Pos.svg";

export default function Logo() {
  return (
    <Box sx={{ display: "flex" }}>
      <Typography level="body-md">A project by</Typography>
      <Link
        target="_blank"
        rel="noopener"
        href="https://dataresearchcenter.org/"
        legacyBehavior>
        <AspectRatio
          style={{ paddingLeft: "12px", width: "61px" }}
          variant="plain"
        >
          <Image fill={true} src={logoSrc} alt="DARC" />
        </AspectRatio>
      </Link>
    </Box>
  );
}
