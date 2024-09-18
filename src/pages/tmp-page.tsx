import builder, { BuilderComponent } from "@builder.io/react";

export const getStaticProps = async () => {
  const pageContent = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/tmp-page",
        customer: "ocuco",
      },
      cachebust: true,
    })
    .toPromise();

  const headerContent = await builder
    .get("header", {
      userAttributes: {
        urlPath: "/tmp-page",
        customer: "ocuco",
      },
      cachebust: true,
    })
    .toPromise();

  const footerContent = await builder
    .get("footer", {
      userAttributes: {
        urlPath: "/tmp-page",
        customer: "ocuco",
      },
      cachebust: true,
    })
    .toPromise();

  return {
    props: { pageContent, headerContent, footerContent },
    revalidate: 5,
  };
};

const Page = ({ pageContent, headerContent, footerContent }: any) => (
  <>
    <BuilderComponent model="header" content={headerContent} />
    <BuilderComponent
      model="page"
      content={pageContent}
      data={{
        exampleEssentialData:
          "This data is essential for the symbol to display correctly",
      }}
    />
    <BuilderComponent model="footer" content={footerContent} />
  </>
);

export default Page;
