import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

interface IFooterLink {
  href: string;
  label: string;
}

const FooterLink = ({ href, label }: React.PropsWithChildren<IFooterLink>) => (
  <Link href={href}>
    <Typography
      level="body-sm"
      sx={(theme) => ({ color: theme.vars.palette.common.black })}
    >
      {label}
    </Typography>
  </Link>
);

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        width: "100%",
        zIndex: 10,
        padding: "2rem 1.5rem",
        backgroundColor: theme.vars.palette.success[300],
        position: { md: "absolute" },
        bottom: 0,
      })}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={5}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          spacing={5}
          alignSelf="center"
        >
          <FooterLink
            href="https://dataresearchcenter.org/contact"
            label="Legal Notice"
          />
          <FooterLink href={"/about"} label="About this page" />
          <FooterLink
            href="https://dataresearchcenter.org/about"
            label="About dataresearchcenter.org"
          />
        </Stack>
        <Typography
          level="body-sm"
          sx={(theme) => ({
            display: { xs: "block", sm: "inline-flex" },
            whiteSpace: "wrap",
            fontWeight: "bold",
            alignSelf: "center",
            textAlign: "center",
            gap: "5px",
            color: theme.vars.palette.common.black,
          })}
        >
          This project has been funded by{" "}
          <FooterLink
            href="https://www.media-lab.de/en/offering/media-tech-lab/"
            label="Media Tech Lab Bayern"
          />{" "}
          and{" "}
          <FooterLink
            href="https://www.miz-babelsberg.de/"
            label="MIZ Babelsberg"
          />
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
