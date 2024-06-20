import React, { useState } from 'react'
import AddPost from './AddPost';
import MyPosts from './MyPosts';
import AllPosts from './AllPosts';
import { FcAddImage } from "react-icons/fc";
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { URL } from "../App";
import { Spinner } from 'react-bootstrap';

const Posts = () => {
    const [activeIcon, setActiveIcon] = useState(null);
    const [showAddPost, setShowAddPost] = useState(false);
    const [showMyPost, setShowMyPost] = useState(false);
    const [showAllPost, setShowAllPost] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const token = localStorage.getItem('token');

    const handleHomeClick = () => {
        setActiveIcon('home');
        setShowAddPost(false);
        setShowMyPost(false);
        setShowAllPost(true);
    };

    const handleAddClick = () => {
        // setActiveIcon('add');
        // setShowMyPost(false);
        // setShowAllPost(false);
        // setShowAddPost(true);
    };

    const handleUserClick = () => {
        setActiveIcon('user');
        setShowAddPost(false);
        setShowAllPost(false);
        setShowMyPost(true);
    };

    const handleFileInputChange = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an Image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        };

        if (pics) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // Store selected image as base64 URL

            };
            reader.readAsDataURL(pics); // Convert file to base64 URL
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dfh9c19ty");
            fetch("https://api.cloudinary.com/v1_1/dfh9c19ty/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
        else {
            toast({
                title: "Please select an Image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

    };

    const submitHandler = async () => {
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(`${URL}/api/posts/addPost`, { post: pic }, config);
            toast({
                title: "Post added Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setSelectedImage(null);
            setPic(null);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    }

    return (
        <div className='posts-top-container'>

            <div className="renderPages">
                {/* {showAddPost && <AddPost />} */}
                {showMyPost && <MyPosts />}
                {showAllPost && <AllPosts />}

                {/* <!-- Modal --> */}
                <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Create new post</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex justify-content-center">
                                    {selectedImage ? <img src={selectedImage} alt="Selected" className="selected-image" /> : (
                                        <label htmlFor="file-upload" className="add-image-icon-label">
                                            <FcAddImage className="add-image-icon" />
                                            {/* Hidden file input */}
                                            <input type="file" accept='image/*' id="file-upload" className="visually-hidden" onChange={(e) => handleFileInputChange(e.target.files[0])} />
                                        </label>
                                    )}
                                    {/* {selectedImage && <img src={selectedImage} alt="Selected" className="selected-image" />} */}

                                </div>
                            </div>
                            <div className="modal-footer">
                                {selectedImage ? <button type="button" className="btn btn-primary" onClick={() => (setSelectedImage(null), setPic(null))}>Discard</button> : <></>}
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => (setSelectedImage(null), setPic(null))}>Close</button>
                                {selectedImage ? <button type="button" className="btn btn-primary" onClick={submitHandler}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Add'}
                                </button> : <></>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer d-flex justify-content-around align-items-center">
                <div className={`footer-icon ${activeIcon === 'home' ? 'active' : ''}`} onClick={handleHomeClick}>
                    <i className={`fas fa-home ${activeIcon === 'home' ? 'active-icon' : ''}`}></i> {/* Home Icon */}
                </div>
                <div className='footer-icon footer-icon-add' onClick={handleAddClick} data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                    <i className='fas fa-plus'></i> {/* Add Icon */}
                </div>
                <div className={`footer-icon ${activeIcon === 'user' ? 'active' : ''}`} onClick={handleUserClick}>
                    <i className={`fas fa-user ${activeIcon === 'user' ? 'active-icon' : ''}`}></i> {/* User Icon */}
                </div>
            </div>
        </div>
    )
}

export default Posts