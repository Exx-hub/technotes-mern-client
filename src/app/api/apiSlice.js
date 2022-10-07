import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storeCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().authState.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      headers.set("alvin", "acosta"); // test
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      console.log("refresh result", refreshResult.data);
      // store the new token
      api.dispatch(storeCredentials({ token: refreshResult.data.accessToken }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});

// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: ["Note", "User"],
//   endpoints: (builder) => ({}),
// });

// fetchBaseQuery is like how you would use axios in another project.
// tagTypes => used for adding a tag to cached data
// endpoints => endpoints for queries

// export const apiSlice = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:3500",
//     credentials: "include",
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().authState.token;

//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//         headers.set("alvin", "acosta"); // test
//       }

//       return headers;
//     },
//   }),
//   tagTypes: ["Note", "User"],
//   endpoints: (builder) => ({}),
// });
