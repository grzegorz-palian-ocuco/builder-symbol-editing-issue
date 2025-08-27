import { Builder } from "@builder.io/react";
import JsonStringComponent from "./json-string.component";

Builder.registerComponent(JsonStringComponent, {
  name: "JsonString",
  inputs: [
    {
      name: "jsonStringContent",
      type: "string",
    },
  ],
});
