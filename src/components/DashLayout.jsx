import React from 'react'
import { Outlet } from 'react-router-dom'
import DashFooter from './DashFooter'

const DashLayout = () => {
  return (
    <>
      <div className='dash-container'>
        <Outlet />
      </div>
      <DashFooter />
    </>
  )
}

export default DashLayout
