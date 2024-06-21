import React, { useEffect, useState } from 'react'
import '../Css Folder/allposts.css'
import axios from 'axios';
import { URL } from "../App";
import { Spinner } from 'react-bootstrap';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { SlOptionsVertical } from "react-icons/sl";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";

const MyPosts = () => {

    // const [noPosts, setNoPosts] = useState(true);
    const [username, setUserName] = useState("");
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showList, setShowList] = useState(false);
    const [activePostId, setActivePostId] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [pic, setPic] = useState();
    const [userId, setUserId] = useState('');

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json",
        },
    };

    const getAllPosts = async () => {
        // setLoading(true);

        try {
            const response = await axios.get(`${URL}/api/posts/posts`, config);
            const { userId, posts } = response.data;
            if (posts.length === 0) {
                // setNoPosts(true);
                setLoading(true);
                toast({
                    title: "No Post Found.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            }
            else {
                setLoading(false);
                // setNoPosts(false);
                setUserId(userId);
                setPosts(posts);
            }

            // toast({
            //     title: "Login Successful",
            //     status: 'success',
            //     duration: 5000,
            //     isClosable: true,
            //     position: 'bottom',
            // });

        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllPosts();
    });

    const toggleList = (postId) => {
        setActivePostId(activePostId === postId ? null : postId);
    }

    const confirmDeletePost = (postId) => {
        setPostToDelete(postId);
        onOpen();
    }

    const deletePost = async () => {
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            };

            await axios.delete(`${URL}/api/posts/deletepost/${postToDelete}`, config);
            toast({
                title: 'Post Deleted Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            getAllPosts();
            onClose();
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            onClose();
        }
    }

    // const handleFileInputChange = (pics) => {
    //     setLoading(true);
    //     if (pics === undefined) {
    //         toast({
    //             title: "Please select an Image!",
    //             status: 'warning',
    //             duration: 5000,
    //             isClosable: true,
    //             position: 'bottom',
    //         });
    //         return;
    //     };

    //     if (pics) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setSelectedImage(reader.result); // Store selected image as base64 URL

    //         };
    //         reader.readAsDataURL(pics); // Convert file to base64 URL
    //     }
    //     if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
    //         const data = new FormData();
    //         data.append("file", pics);
    //         data.append("upload_preset", "chat-app");
    //         data.append("cloud_name", "dfh9c19ty");
    //         fetch("https://api.cloudinary.com/v1_1/dfh9c19ty/image/upload", {
    //             method: "post",
    //             body: data,
    //         })
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 setPic(data.url.toString());
    //                 console.log(data.url.toString());
    //                 setLoading(false);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 setLoading(false);
    //             });
    //     }
    //     else {
    //         toast({
    //             title: "Please select jpg/jpeg/png Image!",
    //             status: 'warning',
    //             duration: 5000,
    //             isClosable: true,
    //             position: 'bottom',
    //         });
    //         setLoading(false);
    //         return;
    //     }

    // };

    // const submitHandler = async (id) => {
    //     setLoading(true);

    //     try {
    //         const config = {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 "Content-type": "application/json",
    //             },
    //         };

    //         const { data } = await axios.put(`${URL}/api/posts/updatepost/${id}`, { post: pic }, config);
    //         toast({
    //             title: "Post Updated Successfully",
    //             status: 'success',
    //             duration: 5000,
    //             isClosable: true,
    //             position: 'bottom',
    //         });

    //         localStorage.setItem("userInfo", JSON.stringify(data));
    //         setSelectedImage(null);
    //         setPic(null);
    //         setLoading(false);
    //     } catch (error) {
    //         toast({
    //             title: "Error Occurred!",
    //             description: error.response.data.message,
    //             status: 'error',
    //             duration: 5000,
    //             isClosable: true,
    //             position: 'bottom',
    //         });
    //         setLoading(false);
    //     }
    // }

    const handleLikePost = async (id) => {
        try {
            const response = await axios.put(`${URL}/api/posts/addlike/${id}`, {}, config);
            getAllPosts();
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };

    return (
        <div className='all-posts-top-ccontainer mt-2'>
            <div className="top-heading-all-posts">My Posts</div>
            <div className="post-container d-flex flex-column align-items-center mt-3">
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    posts.map((post) => (
                        <div className="single-post-holder mt-5" key={post._id}>
                            <div className="top-username-holder d-flex justify-content-between align-items-center px-3">
                                <div>{post.user.username}</div>
                                <div className='list-container'>
                                    <button onClick={() => toggleList(post._id)} className='button-list'><SlOptionsVertical /></button>
                                    {activePostId === post._id && (
                                        <ul className="list-group">
                                            <li className="list-group-item"><MdEdit data-bs-toggle="modal" data-bs-target="#staticBackdrop1" /></li>
                                            <li className="list-group-item mt-1"><MdDelete onClick={() => confirmDeletePost(post._id)} /></li>
                                        </ul>
                                    )}
                                </div>
                                {/* <!-- Modal --> */}
                                {/*  <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Post</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="d-flex justify-content-center">
                                                    {selectedImage ? <img src={selectedImage} alt="Selected" className="selected-image" /> : (
                                                        <label htmlFor="file-upload" className="add-image-icon-label">
                                                            <FcAddImage className="add-image-icon" />
                                                            
                                                            <input type="file" accept='image/*' id="file-upload" className="visually-hidden" onChange={(e) => handleFileInputChange(e.target.files[0])} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                {selectedImage ? <button type="button" className="btn btn-primary" onClick={() => (setSelectedImage(null), setPic(null))}>Discard</button> : <></>}
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => (setSelectedImage(null), setPic(null))}>Close</button>
                                                {selectedImage ? <button type="button" className="btn btn-primary" onClick={() => submitHandler(post._id)}>
                                                    {loading ? <Spinner animation="border" size="sm" /> : 'Update Post'}
                                                </button> : <></>}

                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <div className="actual-post-div d-flex justify-content-center ">
                                <img src={post.post} alt="not found" className='image-container' />
                            </div>
                            <div className="post-footer d-flex flex-column justify-content-center">
                                <div className='d-flex align-items-center'>
                                    {post.likes.includes(userId) ? <FcLike className='icon heart-comment-icons mx-3' style={{ fontSize: '23px', marginBottom: '2px' }} onClick={() => handleLikePost(post._id)} />
                                        : <FaRegHeart
                                            className='icon heart-comment-icons mx-3'
                                            // style={{ cursor: 'pointer', color: post.likes.includes(post.user._id) ? 'red' : 'black' }}
                                            onClick={() => handleLikePost(post._id)}
                                        />}
                                    <FaRegComment className='icon heart-comment-icons' />
                                </div>
                                <div className='mx-3 likes-text'>{post.likes.length} likes</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Post</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete this post?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={deletePost}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default MyPosts