import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";

export default function BlogPostView() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const notyf = new Notyf();

    const [blogPost, setBlogPost] = useState(null);
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`)
            .then(res => res.json())
            .then(data => setBlogPost(data))
            .catch(() => {
                setError("Failed to load blog details.");
                notyf.error("Failed to load blog details.");
            });
    }, [id]);

    if (error) {
        return (
            <Container className="mt-5 text-center">
                <h2 className="text-danger">{error}</h2>
                <Link to="/posts" className="btn btn-dark mt-3">Go Back to Blogs</Link>
            </Container>
        );
    }

    if (!blogPost) {
        return (
            <Container className="mt-5 text-center">
                <h2>Loading blog details...</h2>
            </Container>
        );
    }

    const canEditOrDelete = user && blogPost.author && (user.id === blogPost.author._id || user.isAdmin);

    function handleDelete() {
        setShowModal(true);
    }

    function confirmDelete() {
        setShowModal(false);
        const token = localStorage.getItem("token");
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/delete/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                notyf.success(data.message);
                navigate("/posts");
            } else {
                notyf.error(data.message || "Failed to delete post");
            }
        })
        .catch(() => notyf.error("Delete request failed"));
    }

    function handleCommentSubmit(e) {
        e.preventDefault();
        if (!newComment.trim()) return;
        const token = localStorage.getItem("token");

        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/addComment/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ comment: newComment })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Comment added successfully") {
                setBlogPost(prev => ({
                    ...prev,
                    comments: [
                        ...prev.comments,
                        { 
                            _id: data.updatedPost.comments.slice(-1)[0]._id, 
                            user: { _id: user.id, username: user.username }, 
                            comment: newComment 
                        }
                    ]
                }));
                setNewComment("");
                notyf.success("Comment added!");
            } else {
                notyf.error("Failed to add comment");
            }
        })
        .catch(() => notyf.error("Request failed"));
    }


    function handleDeleteComment(commentId) {
        const token = localStorage.getItem("token");
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/deleteComment/${id}/${commentId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Comment removed successfully") {
                setBlogPost(prev => ({ ...prev, comments: prev.comments.filter(c => c._id !== commentId) }));
                notyf.success("Comment deleted");
            } else {
                notyf.error("Failed to delete comment");
            }
        })
        .catch(() => notyf.error("Request failed"));
    }

    return (
        <Container className="mt-5 post-view-card">
            <Row>
                <Col lg={{ span: 8, offset: 2 }}>
                    <Card>
                        <Card.Body >
                            <div className="text-center">
                                <Card.Title className="post-view-title">{blogPost.title}</Card.Title>
                                <Card.Subtitle className="post-view-subtitle text-muted">
                                    By {blogPost.author?.username || "Unknown"} | {new Date(blogPost.createdAt).toLocaleDateString()}
                                </Card.Subtitle>
                                <Card.Text className="post-view-content">{blogPost.content}</Card.Text>

                                {canEditOrDelete && (
                                    <>
                                        <Button variant="warning" onClick={() => navigate(`/posts/update/${id}`)} >Edit</Button>
                                        <Button variant="danger" onClick={handleDelete} >Delete</Button>
                                    </>
                                )}
                            </div>
                            <Card.Text className="comment-section-title mt-4">Comments:</Card.Text>
                            {blogPost.comments?.length > 0 ? (
                                <ul className="comment-list">
                                    {blogPost.comments.map(commentObj => (
                                        <li key={commentObj._id} className="comment-item">
                                            <strong>{commentObj.user?.username || "Anonymous"}:</strong> {commentObj.comment}
                                            {user?.isAdmin && (
                                                <Button variant="danger" size="sm" className="delete-comment-btn" onClick={() => handleDeleteComment(commentObj._id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p>No comments available.</p>)}
                            {user && (
                                <Form onSubmit={handleCommentSubmit} className="comment-form">
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            className="comment-input"
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary" className="comment-submit-btn mt-2">Comment</Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)} className="delete-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
                <Modal.Footer className="delete-modal-footer-btn">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
