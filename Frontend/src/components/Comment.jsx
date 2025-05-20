import React, { useState, useEffect } from 'react';
import { API_URL } from '../constant';

const Comment = ({ comment, ownerUsername }) => {
    return (
        <div className="comment p-6 mb-6 border-l-4 border-indigo-500 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">
                        {ownerUsername?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                    <p className="font-bold text-gray-100 text-lg">{ownerUsername}</p>
                    <p className="text-xs text-gray-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(comment.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed pl-13">{comment.content}</p>
            <div className="mt-4 flex items-center space-x-4 pl-13">
                <button className="flex items-center text-gray-400 hover:text-indigo-400 transition-colors">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Like
                </button>
                <button className="flex items-center text-gray-400 hover:text-indigo-400 transition-colors">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Reply
                </button>
            </div>
        </div>
    );
};

const CommentsList = ({ videoId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usernames, setUsernames] = useState({});
    const [newComment, setNewComment] = useState(''); // State to hold new comment input
    const [submitting, setSubmitting] = useState(false); // State to manage submission status

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${API_URL}/comment/get-video-comments/${videoId._id}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error: ${response.status}, Message: ${errorText}`);
                    return;
                }

                const data = await response.json();
                const extractedComments = data.data.flatMap(item => item.allComment);

                setComments(extractedComments);
                setLoading(false);

                const usernamesMap = {};
                for (let comment of extractedComments) {
                    const ownerId = comment.owner;
                    if (!usernamesMap[ownerId]) {
                        const userResponse = await fetch(`${API_URL}/users/current-user`, {
                            credentials: "include",
                        });
                        const userData = await userResponse.json();
                        usernamesMap[ownerId] = userData.data.username;
                    }
                }
                setUsernames(usernamesMap);
            } catch (error) {
                console.error('Error fetching comments or usernames:', error);
                setLoading(false);
            }
        };

        fetchComments();
    }, [videoId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/comment/add-comment/${videoId._id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newComment, videoId: videoId._id }),
            });

            if (response.ok) {
                const newCommentData = await response.json();
                setComments(prevComments => [...prevComments, newCommentData.data]);
                setUsernames(prevUsernames => ({
                    ...prevUsernames,
                    [newCommentData.data.owner]: newCommentData.data.username
                }));
                setNewComment(''); // Clear the input field after successful submission
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="comments-list mt-8 max-w-4xl mx-auto px-4">
            <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-gray-700">
                <h4 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Discussion
                </h4>
                
                <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="relative">
                        <textarea
                            className="w-full p-5 pr-32 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none text-lg bg-gray-800 text-gray-100 placeholder-gray-500"
                            rows="3"
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={submitting}
                        ></textarea>
                        <button
                            type="submit"
                            className={`absolute right-4 bottom-4 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                                submitting || !newComment.trim()
                                    ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                            }`}
                            disabled={submitting || !newComment.trim()}
                        >
                            {submitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Posting...
                                </span>
                            ) : (
                                'Post Comment'
                            )}
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                ownerUsername={usernames[comment.owner]} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-xl border border-gray-700">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-xl font-semibold text-gray-200">No comments yet</p>
                            <p className="text-gray-500 mt-2">Be the first to start the conversation!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentsList;
