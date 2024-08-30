import React from 'react'
import Header from '../components/header/Header'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Slidebar'

function Homepage() {
  return (
   <>
    <Header/>
    <div className='flex gap-5'>
      <Sidebar/>
      <Outlet/>
    </div>
   </>
  )
}

export default Homepage
