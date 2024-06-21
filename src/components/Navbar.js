import React from 'react'
import '../Css Folder/wave.css'
import { MdLogout } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react';

const Navbar = () => {
    const location = useLocation();
    const toast = useToast();
    const navigate = useNavigate();

    const logOutUser = () => {
        toast({
            title: 'Logged Out Successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
        });
        localStorage.removeItem('token');
        navigate('/login');

    }

    return (
        <div className='d-flex justify-content-center align-items-center' id='main-nav-box' style={{ height: '95px', width: '100%' }}>
            <div className="fog" />
            {location.pathname === '/posts' && (
                <div style={{ flex: 1 }}></div>
            )}
            <div className='heading-title' style={{ flex: 3, textAlign: 'center' }}>Banao-Mern-Task2</div>
            {location.pathname === '/posts' && (
                <div className='d-flex justify-content-center align-items-center logout-icon' style={{ flex: 1 }}>
                    <MdLogout style={{ cursor: 'pointer' }} onClick={logOutUser} />
                </div>
            )}
        </div >
    )
}

export default Navbar