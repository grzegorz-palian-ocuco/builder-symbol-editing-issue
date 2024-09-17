import builder, { BuilderComponent } from "@builder.io/react";

export const getStaticProps = async () => {
  const pageContent = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/tmp-test-page",
        customer: "ocuco",
      },
      cachebust: true,
    })
    .toPromise();

  const headerContent = await builder
    .get("header", {
      userAttributes: {
        urlPath: "/tmp-test-page",
        customer: "ocuco",
      },
      cachebust: true,
    })
    .toPromise();

  const footerContent = await builder
    .get("footer", {
      userAttributes: {
        urlPath: "/tmp-test-page",
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
    <BuilderComponent
      model="header"
      content={headerContent}
      options={{
        userAttributes: {
          urlPath: "/tmp-test-page",
          customer: "ocuco",
        },
      }}
    />
    <BuilderComponent
      model="page"
      content={pageContent}
      options={{
        userAttributes: {
          urlPath: "/tmp-test-page",
          customer: "ocuco",
        },
        cachebust: true,
      }}
    />
    <BuilderComponent
      model="footer"
      content={footerContent}
      options={{
        userAttributes: {
          urlPath: "/tmp-test-page",
          customer: "ocuco",
        },
        cachebust: true,
      }}
    />
  </>
);

export default Page;
