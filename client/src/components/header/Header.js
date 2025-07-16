import React from 'react'
import { Link } from 'react-router-dom'
 
import Search from './Search'
 
const Header = () => {
 
    return (
        <div className="header bg-light">
            <nav className="navbar navbar-expand-lg navbar-light 
            bg-light justify-content-between align-middle">

                <Link to="/"   className="logo">
                      <h1 className="navbar-brand text-uppercase p-0 mt-2 ml-5" onClick={() => window.scrollTo({ top: 0 })}>
                  Djamel Art
                    </h1>
                     <img src='logo512' className='imagelogo' alt="djamel art" />
                 
                </Link>

                <Search />

                <Menu />
            </nav>
        </div>
    )
}

export default Header
