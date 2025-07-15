import { createApi } from '@reduxjs/toolkit/query/react';
import customApiHandler from '@/lib/redux/api/customApiHandler';    

// Define a service using expected endpoints 🤔
export const api = createApi({
  reducerPath: 'queryHandler',
  baseQuery: customApiHandler(),
  endpoints: () => ({}),
});
