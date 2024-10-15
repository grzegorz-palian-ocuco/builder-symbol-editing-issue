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

const exampleData1 = {
  name: "Product Foo",
  price: 100,
  isAvailable: true,
};

const exampleData2 = {
  name: "Product Bar",
  price: 200,
  isAvailable: false,
};

const Page = ({ pageContent, headerContent, footerContent }: any) => (
  <>
    <BuilderComponent model="header" content={headerContent} />
    <BuilderComponent
      model="page"
      content={pageContent}
      data={{
        exampleProduct: Math.random() > 0.5 ? exampleData1 : exampleData2,
        exampleEssentialData:
          "This data is essential for the symbol to display correctly",
      }}
    />
    <BuilderComponent model="footer" content={footerContent} />
  </>
);

export default Page;
