import React from 'react'

function PageTitle({title}) {
  return (
    <div className='mb-2 md:my-3 md:outline md:outline-1 md:outline-slate-100 md:w-full w-full shadow-sm  md:py-2 p-1 text-xs bg-white  rounded-md'>
        <h1 className=' text-center text-gray-600 text-sm md:text-sm  font-semibold' >{title}</h1>
    </div>
  )
}

export default PageTitle