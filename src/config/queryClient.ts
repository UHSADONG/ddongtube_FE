import { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig : QueryClientConfig = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
        },
        mutations: {
            retry: false,
        },
    },
}