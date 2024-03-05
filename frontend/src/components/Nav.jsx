import React from 'react'
import { Link } from "react-router-dom";

function Nav(props) {
    return (
        <>
            <div className='bg-white flex fixed top-0 left-0 w-[100%] items-center drop-shadow-lg h-[24px]'>
                <div className='flex gap-4 items-center px-4'>
                    <i className='fa-solid fa-bars text-awesomecolor'></i>
                    <Link to='/'><p className='text-awesomecolor'>vACCHUN</p></Link>
                    <i className='fa-solid fa-flag-checkered text-awesomecolor'></i>
                </div>
                <div className='absolute right-0 flex gap-4 px-4 items-center'>
                    <Link to='/'><i className={`fa-solid fa-bug ${props.Active === 'bug' ? 'text-blue-500' : 'text-awesomecolor'}`}></i></Link>
                    <Link to='/'><i className={`fa-solid fa-file-video ${props.Active === 'file-video' ? 'text-blue-500' : 'text-awesomecolor'}`}></i></Link>
                    <Link to='/'><i className={`fa-solid fa-table ${props.Active === 'table' ? 'text-blue-500' : 'text-awesomecolor'}`}></i></Link>
                    <Link to='/'><i className={`fa-solid fa-laptop ${props.Active === 'laptop' ? 'text-blue-500' : 'text-awesomecolor'}`}></i></Link>
                    <Link to='/'><i className={`fa-solid fa-user ${props.Active === 'user' ? 'text-blue-500' : 'text-awesomecolor'}`}></i></Link>
                    <Link to='/admin'><i className={`fa-solid fa-bulldozer ${props.Active === 'bulldozer' ? 'text-blue-500' : 'text-awesomecolor'}`}></i></Link>
                </div>
            </div>
        </>
    )
}

export default Nav