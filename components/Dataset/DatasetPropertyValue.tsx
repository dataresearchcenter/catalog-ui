import Image from "next/image";
import Link from "next/link";
import Typography from "@mui/joy/Typography";
import iconDocuments from "~/assets/icons/documents.svg";
import iconFrequency from "~/assets/icons/frequency.svg";
import iconMixed from "~/assets/icons/mixed.svg";
import iconStructured from "~/assets/icons/structured.svg";
import { CountryFlag } from "../CountryLabel";
import Property from "../Property";

const ICONS = {
  documents: iconDocuments,
  structured: iconStructured,
  mixed: iconMixed,
};

type DatasetPropertyValueProps = {
  value: string | number | null | undefined;
  displayValue?: string;
  type?: string;
  href?: string | null;
  style?: any;
};

export default function DatasetPropertyValue({
  displayValue,
  value,
  type,
  href,
  style,
}: DatasetPropertyValueProps) {
  if (value === null || value === undefined) return null;

  let startDecorator;

  if (type === "frequency") {
    startDecorator = (
      <Image src={iconFrequency} alt={value?.toString() || "frequency icon"} />
    );
  } else if (type === "country") {
    startDecorator = <CountryFlag iso={value as string} />;
  } else if (type === "datatype") {
    // @ts-ignore
    const iconSrc = ICONS[value.toString().toLowerCase()];
    startDecorator = (
      <Image src={iconSrc} alt={value?.toString() || "datatype icon"} />
    );
  }

  const content = (
    <Typography level="body-sm" startDecorator={startDecorator} sx={style}>
      <Property value={displayValue || value} type={type} />
    </Typography>
  );

  if (href) {
    return <Link href={href} legacyBehavior>{content}</Link>;
  }

  return content;
}
