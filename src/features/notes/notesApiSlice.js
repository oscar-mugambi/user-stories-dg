import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { apiSlice } from '../../app/api/apiSlice'

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
})

const initialState = notesAdapter.getInitialState()

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: '/notes',
        validateStatus: (response, result) => response.status === 200 && !result.isError,
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id
          return note
        })
        return notesAdapter.setAll(initialState, loadedNotes)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [{ type: 'Note', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Note', id }))]
        } else {
          return [{ type: 'Note', id: 'LIST' }]
        }
      },
    }),
    addNote: builder.mutation({
      query: (initialNoteState) => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...initialNoteState,
        },
      }),
      invalidatesTags: [{ type: 'Note', id: 'List' }],
    }),
    updateNote: builder.mutation({
      query: (initialNoteState) => ({
        url: '/notes',
        method: 'PATCH',
        body: {
          ...initialNoteState,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),

    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: '/notes',
        method: 'PATCH',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),
  }),
})

export const {
  useGetNotesQuery,
  useUpdateNoteMutation,
  useAddNoteMutation,
  useDeleteNoteMutation,
} = noteApiSlice

export const selectNoteResult = noteApiSlice.endpoints.getNotes.select()

//create memoized selector

const selectNoteData = createSelector(selectNoteResult, (noteResult) => noteResult.data)

// getSelectors creates these selectors and we rename them with aliases

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors((state) => selectNoteData(state) ?? initialState)
