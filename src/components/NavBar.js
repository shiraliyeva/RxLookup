import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
    <nav className='box NavBar'>
        <div className='navbar-left'>
          <Link className='navbar-left home' to='/'>RxLookup</Link>
        </div>
        <div className='navbar-right'>
            <Link className='navbar-right home' to='/'>Home</Link>
            <span className='navbar dash'> | </span>
            <Link className='navbar-right info' to='/Info'>Info</Link>
        </div>
    </nav>
    </>
  )
}

export default NavBar;

