import { BuilderBlocks, StateProvider } from "@builder.io/react";

const TestComponent = (props: {
  builderContent: {
    content: React.ReactNode;
  };
}) => {
  const exampleFunction = () => {
    console.log("Example function");
  };

  return (
    <div>
      <h2>
        Example 1 - function outside of the object with the bound property
      </h2>
      <StateProvider
        state={{
          contentData: { someString: "Example 1", someBoolean: true },
          exampleFunction,
        }}
      >
        <BuilderBlocks
          dataPath="component.options.builderContent.content"
          blocks={props.builderContent?.content}
        />
      </StateProvider>
      <h2>Example 2 - no function</h2>
      <StateProvider
        state={{
          contentData: { someString: "Example 2", someBoolean: true },
        }}
      >
        <BuilderBlocks
          dataPath="component.options.builderContent.content"
          blocks={props.builderContent?.content}
        />
      </StateProvider>
      <h2>
        Example 3 (broken) - function in the same object as the bound property
      </h2>
      <StateProvider
        state={{
          contentData: {
            someString: "Example 3",
            someBoolean: true,
            exampleFunction,
          },
        }}
      >
        <BuilderBlocks
          dataPath="component.options.builderContent.content"
          blocks={props.builderContent?.content}
        />
      </StateProvider>
    </div>
  );
};

export default TestComponent;
