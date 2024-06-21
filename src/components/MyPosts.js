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
import { FcAddImage } from "react-icons/fc";

const MyPosts = () => {

    // const [noPosts, setNoPosts] = useState(true);
    const [username, setUserName] = useState("");
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMyPost, setLoadingMyPost] = useState(false);
    const [showList, setShowList] = useState(false);
    const [activePostId, setActivePostId] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [selectedImageEdit, setSelectedImageEdit] = useState(null);
    const [picEdit, setPicEdit] = useState();
    const [userId, setUserId] = useState('');
    const [newComment, setNewComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);
    const [loadingComment, setLoadingComment] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);

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
        // setLoadingMyPost(true);
        try {
            const response = await axios.get(`${URL}/api/posts/myposts`, config);
            const { userId, posts } = response.data;
            if (posts.length === 0) {
                // setNoPosts(true);
                setLoadingMyPost(true);
                toast({
                    title: "No Post Found.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            }
            else {
                setLoadingMyPost(false);
                // setNoPosts(false);
                setUserId(userId);
                setPosts(posts);
            }

        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingMyPost(false);
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

    const handleComment = async (id) => {
        // setLoading(true);
        setCurrentPostId(id);
        try {
            const response = await axios.get(`${URL}/api/comments/${id}/getallcomments`, config);
            const allComments = response.data;
            if (allComments.length === 0) {
                // setNoPosts(true);
                // setLoading(true);
                toast({
                    title: "No Comments Found.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            }
            else {
                // setLoading(false);
                // setNoPosts(false);
                setComments(prevComments => ({
                    ...prevComments,
                    [id]: allComments
                }));
            }
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            // setLoading(false);
        }
    };

    const handleAddComment = async () => {
        setLoadingComment(true);
        if (!newComment.trim()) {
            toast({
                title: "Add some comment text first",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingComment(false);
            return;
        }

        try {
            const response = await axios.post(`${URL}/api/comments/addcomment`, { postId: currentPostId, text: newComment }, config);
            // setComments([...comments, response.data]);
            toast({
                title: "Comment added Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            handleComment(currentPostId);
            setNewComment('');
            setLoadingComment(false);
        } catch (error) {
            toast({
                title: error.response?.data?.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingComment(false);
        }
    };

    const handleFileInputChangeEdit = (picsEdit) => {
        setLoadingEdit(true);
        if (picsEdit === undefined) {
            toast({
                title: "Please select an Image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingEdit(false);
            return;
        };

        if (picsEdit) {
            const readerEdit = new FileReader();
            readerEdit.onloadend = () => {
                setSelectedImageEdit(readerEdit.result); // Store selected image as base64 URL
            };
            readerEdit.readAsDataURL(picsEdit); // Convert file to base64 URL
        }
        if (picsEdit.type === "image/jpeg" || picsEdit.type === "image/png" || picsEdit.type === "image/jpg") {
            const data = new FormData();
            data.append("file", picsEdit);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dfh9c19ty");
            fetch("https://api.cloudinary.com/v1_1/dfh9c19ty/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPicEdit(data.url.toString());
                    console.log(data.url.toString());
                    setLoadingEdit(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoadingEdit(false);
                });
        }
        else {
            toast({
                title: "Please select jpg/jpeg/png Image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingEdit(false);
            return;
        }

    };

    const submitHandlerEdit = async (id) => {
        setLoadingEdit(true);

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.put(`${URL}/api/posts/updatepost/${id}`, { post: picEdit }, config);
            toast({
                title: "Post added Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setSelectedImageEdit(null);
            setPicEdit(null);
            setLoadingEdit(false);
            getAllPosts();
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoadingEdit(false);
        }
    }

    return (
        <div className='all-posts-top-ccontainer mt-2'>
            <div className="top-heading-all-posts">My Posts</div>
            <div className="post-container d-flex flex-column align-items-center mt-3">
                {loadingMyPost ? (
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
                                            <li className="list-group-item"><MdEdit data-bs-toggle="modal" data-bs-target="#staticBackdropEdit" /></li>
                                            <li className="list-group-item"><MdDelete onClick={() => confirmDeletePost(post._id)} /></li>
                                        </ul>
                                    )}
                                </div>
                                {/* <!-- Modal --> */}
                                <div className="modal fade" id="staticBackdropEdit" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Post</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => (setSelectedImageEdit(null), setPicEdit(null))}></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="d-flex justify-content-center">
                                                    {selectedImageEdit ? <img src={selectedImageEdit} alt="SelectedEdit" className="selected-imageEdit" /> : (
                                                        <label htmlFor="file-uploadEdit" className="add-image-icon-label">
                                                            <FcAddImage className="add-image-icon" />
                                                            {/* Hidden file input */}
                                                            <input type="file" accept='image/*' id="file-uploadEdit" className="visually-hidden" onChange={(e) => handleFileInputChangeEdit(e.target.files[0])} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                {selectedImageEdit ? <button type="button" className="btn btn-primary" onClick={() => (setSelectedImageEdit(null), setPicEdit(null))}>Discard</button> : <></>}
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => (setSelectedImageEdit(null), setPicEdit(null))}>Close</button>
                                                {selectedImageEdit ? <button type="button" className="btn btn-primary" onClick={() => submitHandlerEdit(post._id)}>
                                                    {loadingEdit ? <Spinner animation="border" size="sm" /> : 'Update Post'}
                                                </button> : <></>}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="actual-post-div d-flex justify-content-center ">
                                <img src={post.post} alt="not found" className='image-container' />
                            </div>
                            <div className="post-footer d-flex flex-column justify-content-center">
                                <div className='d-flex align-items-center'>
                                    {post.likes.includes(userId) ? <FcLike className='icon heart-comment-icons mx-3' style={{ fontSize: '23px', marginBottom: '2px' }} onClick={() => handleLikePost(post._id)} />
                                        : <FaRegHeart
                                            className='icon heart-comment-icons mx-3'
                                            onClick={() => handleLikePost(post._id)}
                                        />}
                                    <FaRegComment
                                        className='icon heart-comment-icons'
                                        onClick={() => handleComment(post._id)}
                                        data-bs-toggle="modal" data-bs-target="#staticBackdrop3"
                                    />
                                </div>
                                <div className='mx-3 likes-text'>{post.likes.length} likes</div>

                                {/* <!-- Modal --> */}
                                <div className="modal fade" id="staticBackdrop3" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Comments</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setNewComment('')}></button>
                                            </div>
                                            <div className="modal-body">
                                                {comments[currentPostId] && comments[currentPostId].length > 0 ? (
                                                    <div className="comments-section mx-3 mt-2">
                                                        {comments[currentPostId].map(comment => (
                                                            <div key={comment._id} className="single-comment">
                                                                <strong>{comment.user.username}:</strong> {comment.text}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="no-comments-found mx-3 mt-2">
                                                        No comments found.
                                                    </div>
                                                )}
                                            </div>
                                            <div className="modal-footer d-flex justify-content-between">
                                                <input className='comment-add-input' placeholder='Add a Comment' value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                                <button type="button" className="btn btn-primary" onClick={handleAddComment} disabled={loadingComment}>
                                                    {loadingComment ? <Spinner animation="border" size="sm" /> : 'Add Comment'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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