"use client";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const ReactQuerySetup = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQuerySetup;
