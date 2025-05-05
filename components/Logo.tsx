import Image from "next/image";
import Link from "next/link";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Box from "@mui/system/Box";
import logoSrc from "~/assets/DARC_basic_light.svg";

export default function Logo() {
  return (
    <Box sx={{ display: "flex" }}>
      <Typography level="body-md">A project by</Typography>
      <Link target="_blank" rel="noopener" href="https://dataresearchcenter.org/">
        <AspectRatio
          style={{ width: "61px" }}
          variant="plain"
        >
          <Image fill={true} src={logoSrc} alt="||)·|()" />
        </AspectRatio>
      </Link>
    </Box>
  );
}
