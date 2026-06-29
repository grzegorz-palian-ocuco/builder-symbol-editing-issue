import builder, { BuilderComponent } from "@builder.io/react";

export const getStaticProps = async () => {
  const pageContent = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/tmp-cross-origin-error",
        customer: "ocuco",
      },
      cachebust: true,
    })
    .toPromise();

  return {
    props: { pageContent },
    revalidate: 5,
  };
};

const Page = ({ pageContent }: any) => (
  <>
    <BuilderComponent
      model="page"
      content={pageContent}
    />
  </>
);

export default Page;
