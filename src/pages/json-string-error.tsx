import builder, { BuilderComponent } from "@builder.io/react";

export const getStaticProps = async () => {
  const pageContent = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/json-string-error",
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
  <BuilderComponent
    model="page"
    content={pageContent}
    data={{
      pill: {
        style:
          '{ "backgroundColor": "brown", "border": "1x solid red", "color": "white" }',
      },
    }}
  />
);

export default Page;
