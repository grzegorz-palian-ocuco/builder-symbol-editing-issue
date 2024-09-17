import { BuilderComponent } from "@builder.io/react";

const Page = () => (
  <>
    <BuilderComponent
      model="header"
      options={{
        userAttributes: {
          urlPath: "/tmp-test-page",
          customer: "ocuco",
        },
      }}
    />
    <BuilderComponent
      model="page"
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
