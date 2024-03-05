import React from 'react'

export default function Loading(props) {
  return (
    <div className='h-screen w-screen absolute flex justify-center items-center flex-col'>
      <i className="fa-solid fa-spinner animate-spin text-3xl"></i>
      <p>{props.message ? props.message : ""}</p>
    </div>
  )
}
