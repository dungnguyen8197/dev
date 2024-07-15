import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export { queryClient };
