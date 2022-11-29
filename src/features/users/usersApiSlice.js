import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response, result) => response.status === 200 && !result.isError,
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id
          return user
        })
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [{ type: 'User', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'User', id }))]
        } else {
          return [{ type: 'User', id: 'LIST' }]
        }
      },
    }),
  }),
})

export const { useGetUsersQuery } = userApiSlice

export const selectUserResult = userApiSlice.endpoints.getUsers.select()

//create memoized selector

const selectUserData = createSelector(selectUserResult, (userResult) => userResult.data)

// getSelectors creates these selectors and we rename them with aliases

const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUserData(state) ?? initialState)

// export const selectPostByUser = createSelector(
// [selectAllPosts, (state, userId) => userId],
// (posts, userId)=>{
//    return posts.filter(post => post.userId === userId)
// }
// )

// the input params are the dependencies that provide the input params for the output functions for our memoized selectors
// We only get something new from the selector when either posts or userId changes

// const postsByUser = useSelector(state => selectPostByUser(state, userId))

// Normalization means no duplication of data and storing item in a look up table by item id
// { posts: { ids: [1,2,3,4,...], entities: {'1': {userId: 1, id:1 title}, '2':{}}}}
// When normalized data is used with RTK, you get a createEntityAdapter api, and that makes your slices less complicated

// const postAdapter = createEntityAdapter({ sortComparer: (a,b) => b.date.localeCompare(a.date)})
// const initialState = postAdapter.getInitialState({ status:'idle', error: null })

// getInitialState will return the normalized objects with the entities object

// To retrieve a post one does
// const post = state.entities[postId]

// To add a post to the object we use tbe adapters own crud methods

// postAdapter.upsertMany(state, loadedPosts)

// To add a new post

// postAdapter.addOne(state, action.payload)

// To update a post

// postAdapter.upsertOne(state, action.payload)

// To delete a post

// postAdaptor.removeOne(state, id)

// Replace selectors with get selectors that were automatically generated by the adapter

// export const { selectAll, selectById, selectIds } = postAdapter.getSelectors(state=> state.posts)

// Instead of const posts = useSelector(selectAllPosts)
// We do const orderedPostIds = useSelector(selectPostIds)
// The pass the postId to the Post component. We will get the matching post in that component

// const post = useSelector(state=> selectPostById(state, postId))