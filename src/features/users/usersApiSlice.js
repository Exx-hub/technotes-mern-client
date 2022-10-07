import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users", // appended to baseQueryUrl in apiSlice => "http://localhost:3500/users"
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError; // tricky condition but needed
        },
      }),
      // keepUnusedDataFor: 5, // default is 60 seconds (cached data)
      transformResponse: (responseData) => {
        // gets response from query
        // console.log(responseData)
        const loadedUsers = responseData.data.map((user) => {
          // mapping through response and converting data
          user.id = user._id; // transforming _id property from database to just id
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers); // try passing loaded users without transforming*
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    addUser: builder.mutation({
      query: (newUserData) => ({
        url: "/users",
        method: "POST",
        body: newUserData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (updatedUserData) => ({
        url: "/users",
        method: "PATCH",
        body: updatedUserData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: "/users",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// automatically genrates hooks that starts with use and ends with query and using the name of the method
// from your endpoins
export const {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
