import React from 'react'

function Nav() {
    return (
        <>
            <div className='bg-white flex fixed top-0 left-0 w-[100%] items-center'>
                <div className='flex gap-4 items-center px-4'>
                    <i className='fa-solid fa-bars text-awesomecolor'></i>
                    <p className='text-awesomecolor'>vACCHUN</p>
                    <i className='fa-solid fa-flag-checkered text-awesomecolor'></i>
                </div>
                <div className='absolute right-0 flex gap-4 px-4'>
                    <i className='fa-solid fa-bug text-awesomecolor'></i>
                    <i className='fa-solid fa-file-video text-awesomecolor'></i>
                    <i className='fa-solid fa-table text-awesomecolor'></i>
                    <i className='fa-solid fa-laptop text-awesomecolor'></i>
                    <i className='fa-solid fa-user text-awesomecolor'></i>
                    <i className="fa-solid fa-bulldozer text-awesomecolor"></i></div>

            </div>
        </>
    )
}

export default Nav