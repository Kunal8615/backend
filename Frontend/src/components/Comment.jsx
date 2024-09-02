import React, { useState, useEffect } from 'react';
import { API_URL } from '../constant';

const Comment = ({ comment, ownerUsername }) => {
    return (
        <div className="comment p-4 mb-4 border-2 border-gray-400 rounded-lg bg-gray-50 shadow-lg">
            <p className="font-bold text-blue-700">{ownerUsername}</p> {/* Displaying the fetched username */}
            <p className="text-black mt-2">{comment.content}</p> {/* Comment content with spacing */}
            <p className="text-xs text-gray-500 mt-3">{new Date(comment.createdAt).toLocaleString()}</p> {/* Displaying the comment date */}
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
        return <p>Loading comments...</p>;
    }

    return (
        <div className="comments-list mt-4">
            <h4 className="text-lg font-semibold mb-3">Comments</h4>
            
            {/* Comment Submission Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                    className="w-full p-3 border border-gray-400 rounded-lg mb-2"
                    rows="1"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submitting}
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    disabled={submitting || !newComment.trim()}
                >
                    {submitting ? 'Submitting...' : 'Add Comment'}
                </button>
            </form>

            {/* Displaying Comments */}
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        ownerUsername={usernames[comment.owner]} 
                    />
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
};

export default CommentsList;
