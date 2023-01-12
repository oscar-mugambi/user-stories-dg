import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById, useGetUsersQuery } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import PulseLoader from 'react-spinners/PulseLoader'

const EditUser = () => {
  const { id } = useParams()

  // const user = useSelector((state) => selectUserById(state, id))

  const { user } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  })

  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

  return content
}
export default EditUser
