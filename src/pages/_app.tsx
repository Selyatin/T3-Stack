import { type AppType } from "next/app";

import { api } from "../utils/api";

import "@fortawesome/fontawesome-svg-core/styles.css";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
