import { Builder } from "@builder.io/react";
import { EmbeddedBuilderBlocks } from "src/components/embedded-builder-blocks.component";
import {
  getBuilderBlockInputsForDataPaths,
  withEmbeddedBuilderContent,
} from "src/components/embedded-builder-blocks.utils";

const ExampleComponentBase = () => (
  <EmbeddedBuilderBlocks
    builderDataPath="content"
    builderState={{
      example: {
        isEnabled: true,
        onExample: () => {
          console.log("example");
        },
      },
    }}
  />
);

const ExampleComponent = withEmbeddedBuilderContent(ExampleComponentBase);

Builder.registerComponent(ExampleComponent, {
  name: "ExampleComponent",
  inputs: [...getBuilderBlockInputsForDataPaths(["content"])],
});
