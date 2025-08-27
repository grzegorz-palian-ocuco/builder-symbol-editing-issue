export default function JsonStringComponent({
  jsonStringContent,
}: {
  jsonStringContent: string;
}) {
  // Expected to see a double-stringified object, eg.
  // "{ \"backgroundColor\": \"brown\", \"border\": \"1x solid red\", \"color\": \"white\" }"
  return <pre>{JSON.stringify(jsonStringContent, null, 2)}</pre>;
}
