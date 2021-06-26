import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import App from "./App";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
});

const appId = "0ECkn4ty46Pk8fduuLNR7RhJyhCyx6dcn4WmU3VS";
const serverUrl = "https://izx06itvzfgv.moralis.io:2053/server";

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
