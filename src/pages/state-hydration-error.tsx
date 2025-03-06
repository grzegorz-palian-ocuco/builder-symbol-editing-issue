import builder, { BuilderComponent } from "@builder.io/react";

export const getStaticProps = async () => {
  const pageContent = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/state-hydration-error",
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
  <BuilderComponent model="page" content={pageContent} />
);

export default Page;
