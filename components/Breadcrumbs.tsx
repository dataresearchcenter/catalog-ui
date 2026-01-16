import Link from "next/link";
import MuiBreadcrumbs from "@mui/joy/Breadcrumbs";
import Typography from "@mui/joy/Typography";

export type TBreadrumb = { label: string | React.ReactNode; url?: string };

export default function Breadcrumbs({ crumbs }: { crumbs: TBreadrumb[] }) {
  if (crumbs.length == 0) return null;
  return (
    <MuiBreadcrumbs
      sx={{ padding: 0 }}
      slotProps={{
        li: {
          sx: (theme) => ({
            color: theme.palette.common.black,
            fontSize: "sm",
          }),
        },
      }}
    >
      {crumbs.map(({ label, url }, ix) =>
        url ? (
          <Link key={ix} href={url} legacyBehavior>
            {label}
          </Link>
        ) : (
          <Typography key={ix}>{label}</Typography>
        ),
      )}
    </MuiBreadcrumbs>
  );
}
