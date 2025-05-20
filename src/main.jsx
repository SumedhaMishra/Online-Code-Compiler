import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  //Commented out the strict mode of the react because it was double rendering the editor and made it faulty.
  //<React.StrictMode>
   <ChakraProvider>
      <App />
   </ChakraProvider>
  //</React.StrictMode>
);
