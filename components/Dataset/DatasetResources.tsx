import Link from "@mui/joy/Link";
import Table from "@mui/joy/Table";
import { IResource } from "@investigativedata/ftmq";
import { IDatasetTransformed } from "~/util/transformFTM";

function DatasetResourceRow(props: { resource: IResource }) {
  const { name, url, title, mime_type, mime_type_label, size } = props.resource;
  return (
    <tr>
      <td>
        <Link href={url}>{title || name}</Link>
      </td>
      <td>{size}b</td>
      <td>
        <code>{mime_type_label || mime_type || "unknown"}</code>
      </td>
    </tr>
  );
}

export default function DatasetResources(props: {
  dataset: IDatasetTransformed;
}) {
  if (!props.dataset.resources?.length) return null;
  return (
    <Table variant="outlined" size="lg">
      <thead>
        <tr>
          <td>File</td>
          <td>Size</td>
          <td>Data format</td>
        </tr>
      </thead>
      <tbody>
        {props.dataset.resources.map((r) => (
          <DatasetResourceRow key={r.url} resource={r} />
        ))}
      </tbody>
    </Table>
  );
}
