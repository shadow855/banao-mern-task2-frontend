import React from 'react'
import '../Css Folder/wave.css'

const Navbar = () => {

    return (
        <div className='d-flex justify-content-center align-items-center' id='main-nav-box' style={{ height: '95px', width: '100%' }}>
            <div className="fog" />
            <div style={{ fontSize: '38px' }}>Banao-Mern-Task2</div>
        </div >
    )
}

export default Navbar