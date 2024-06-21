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
        </div>
    )
}

export default AllPosts