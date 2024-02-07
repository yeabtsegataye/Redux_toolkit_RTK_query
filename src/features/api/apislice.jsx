import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    //baseQuery: fetchBaseQuery(),
    // We are not specifying a base URL here. Each endpoint will define its own base URL.

    tagTypes: ['post', 'User'],  
    // This line declares tag types for the cache. Tag types are used to categorize
    // cached data. Here, we're declaring that data fetched by this API can be tagged
    // as either 'post' or 'User', allowing more granular cache management.

    endpoints: builder => ({})
    // This line defines the API endpoints using the provided builder function.
    // However, it's currently empty, meaning no endpoints are defined yet.
    // Endpoints should be defined here to specify the actual API requests and their configurations.
    // We need to fill this out with actual endpoint definitions.
})
