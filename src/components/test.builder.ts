import { Builder } from "@builder.io/react";
import TestComponent from "./test.component";

Builder.registerComponent(TestComponent, {
  inputs: [
    {
      name: "builderContent",
      type: "object",
      hideFromUI: true,
      subFields: [
        {
          name: "content",
          type: "uiBlocks",
          defaultValue: [
            {
              "@type": "@builder.io/sdk:Element",
              layerName: "content",
            },
          ],
        },
      ],
    },
  ],
  name: "TestParent",
  description: "",
});
