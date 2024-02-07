import { apiSlice } from "../api/apislice";
import { sub } from 'date-fns';
import { createEntityAdapter } from "@reduxjs/toolkit";

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
}) /// this will sort the data based on date in descending order
//sortComparer: (a, b) => a.date.localeCompare(b.date) tis is on ascending order

const initialState = postsAdapter.getInitialState()
//When you use selectors provided by createEntityAdapter to retrieve entities from the Redux store, such as selectAll or selectEntities, the adapter sorts the entities based on the sortComparer function before returning them. So, the entities are sorted dynamically within the Redux store whenever those selectors are used to access the data.
export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        /////////////////////
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                { type: 'Post', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        //////////////////////
        getPostsByUserId: builder.query({
            query: id => `/posts/?userId=${id}`,
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                })
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        ///////////////////////
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        ////////////////////
        updatePost: builder.mutation({
            query: (initialState) => ({
                url: `/posts/${initialState.id}`,
                method: 'PUT',
                body: {
                    ...initialState,
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags: (result, error, arg) => [ //This is a function that specifies which cache tags should be invalidated after the mutation completes
                { type: 'Post', id: arg.id }
            ]
        }),
        ///////////////////////
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `posts/${postId}`,
                method: 'PATCH',
                // In a real app, we'd probably need to base this on user ID somehow
                // so that a user can't do the same reaction more than once
                body: { reactions }
            }),
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const pathResult = dispatch(
                    // updateQueryData takes three arguments: the name of the endpoint to update, 
                    //the same cache key value used to identify the specific cached data, 
                    //and a callback that updates the cached data.
                    extendedApiSlice.util.updateQueryData('getPosts', 'getPosts', draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice

                        const post = draft.entities[postId]
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    pathResult.undo()
                }
            }
        })
    })
})
export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice