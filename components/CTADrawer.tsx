import Image from "next/image";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import iconOkHand from "~/assets/icons/ok.svg";

const DrawerContentItem = ({ children }: React.PropsWithChildren) => (
  <Typography
    level="body-md"
    sx={{
      paddingBottom: "2rem",
      fontWeight: "500",
    }}
  >
    {children}
  </Typography>
);

export type TCTADrawer = {
  open: boolean;
  onClose: () => void;
};

export default function CTADrawer({ open, onClose }: TCTADrawer) {
  return (
    <Drawer
      anchor="right"
      color="warning"
      variant="soft"
      open={open}
      onClose={onClose}
      slotProps={{
        content: {
          sx: (theme) => ({
            backgroundColor: theme.vars.palette.common.white,
          }),
        },
      }}
    >
      <ModalClose
        sx={(theme) => ({
          backgroundColor: "inherit",
          "&:hover": {
            backgroundColor: "inherit",
          },
          color: theme.vars.palette.common.black,
        })}
      />
      <Stack
        sx={{
          padding: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "3rem" },
          position: "relative",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <DrawerContentItem>
          Do you want to use this dataset in your next investigation?
        </DrawerContentItem>
        <DrawerContentItem>
          We can provide you with a no-worries-all-in service to manage all your data.
        </DrawerContentItem>
        <DrawerContentItem>Interested?</DrawerContentItem>
        {/* TODO: add CTA destination link */}
        <Button
          variant="outlined"
          size="md"
          component="a"
          href="mailto:hi@dataresearchcenter.org"
          sx={{ width: "fit-content" }}
        >
          Get in touch
        </Button>
        <AspectRatio
          ratio="1/1"
          sx={{ width: "60%", alignSelf: "flex-end" }}
          variant="plain"
        >
          <Image
            fill={true}
            src={iconOkHand}
            alt="ok hand icon"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
      </Stack>
    </Drawer>
  );
}
