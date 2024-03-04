import React from 'react'

export default function Loading(props) {
  return (
    <div>
      <i className="fa-solid fa-spinner animate-spin text-3xl"></i>
      <p>{props.message ? props.message : ""}</p>
    </div>
  )
}
