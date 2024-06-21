import React, { useEffect, useState } from 'react'
import '../Css Folder/allposts.css'
import axios from 'axios';
import { URL } from "../App";
import { Spinner } from 'react-bootstrap';
import { useToast } from '@chakra-ui/react';
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";

const AllPosts = () => {
    // const [noPosts, setNoPosts] = useState(true);
    const [username, setUserName] = useState("");
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [newComment, setNewComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);

    const toast = useToast();

    const token = localStorage.getItem('token');
    // console.log(token)
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
    }, []);

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
        if (!newComment.trim()) return;

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
        } catch (error) {
            toast({
                title: error.response?.data?.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };

    return (
        <div className='all-posts-top-ccontainer mt-2'>
            <div className="top-heading-all-posts">All Posts</div>
            <div className="post-container d-flex flex-column align-items-center mt-3">
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    posts.map((post) => (
                        <div className="single-post-holder mt-5" key={post._id}>
                            <div className="top-username-holder d-flex align-items-center px-3">{post.user.username}</div>
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
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                                <button type="button" className="btn btn-primary" onClick={handleAddComment}>Add Comment</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AllPosts