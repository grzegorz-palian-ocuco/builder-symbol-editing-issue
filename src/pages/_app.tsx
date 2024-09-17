import { builder } from '@builder.io/sdk';

builder.init(
  process.env.NEXT_PUBLIC_BUILDER_KEY || '25f89c4d468845dd957d62fa3292ec92'
);

const MyApp = ({ Component, pageProps = {} }: any) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Component {...pageProps} />
);

export default MyApp;
