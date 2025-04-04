type LoadingProps = {
  message: string
}

export default function Loading({message}: LoadingProps) {
  return (
    <div className='h-screen w-screen fixed flex justify-center items-center flex-col'>
      <i className="fa-solid fa-spinner animate-spin text-3xl"></i>
      <p>{message ? message : ""}</p>
    </div>
  )
}
