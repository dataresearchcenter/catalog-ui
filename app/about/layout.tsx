import type { Metadata } from "next";
import ContentWrapper from "~/components/ContentWrapper";
import Page from "~/components/Page";
import { PAGE_TITLE } from "~/settings";

export const metadata: Metadata = {
  title: "About · " + PAGE_TITLE,
  description: `
  Find the data for your investigations: We put together more than 200 datasets
  in the FollowTheMoney format that are ready to use for investigative data
  journalism. These data can be imported into OpenAleph. The Data and Research Center is
  an independent technology organization created by journalists for journalists. We
  provide a secure research platform on independent infrastructure and support
  editorial projects doing investigative data journalism.
  `,
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const crumbs = [
    {
      label: "Back to Data Catalog",
      url: "/",
    },
  ];
  return (
    <Page crumbs={crumbs}>
      <ContentWrapper>{children}</ContentWrapper>
    </Page>
  );
}
