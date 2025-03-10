import { useState, useEffect, useContext } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";

const notyf = new Notyf();

export default function AdminDashboard({ blogData, fetchData }) {
    const { user } = useContext(UserContext);
    const [blogPosts, setBlogPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const navigate = useNavigate();

    console.log("AdminDashboard - User Context:", user);

    // Function to show the delete confirmation modal
    const handleDeleteClick = (postId) => {
        setPostToDelete(postId);
        setShowModal(true);
    };

    // Function to confirm and delete the post
    const confirmDelete = async () => {
        setShowModal(false);
        if (!postToDelete) return;

        console.log("Deleting Post - Current User:", user);

        if (!user || !user.id) {
            notyf.error("User data not available. Please log in again.");
            return;
        }

        const endpoint = user.isAdmin
            ? `${process.env.REACT_APP_API_BASE_URL}/posts/admin/delete/${postToDelete}`
            : `${process.env.REACT_APP_API_BASE_URL}/posts/delete/${postToDelete}`;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                notyf.error("No authentication token found. Please log in.");
                return;
            }

            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                notyf.success("Post deleted successfully!");
                fetchData();
            } else {
                notyf.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            notyf.error("An error occurred while deleting the post.");
        }
    };

    useEffect(() => {
        setBlogPosts(blogData.map((post) => (
            <tr key={post._id}>
                <td>{post._id}</td>
                <td>{post.title}</td>
                <td>{post.author.username}</td>
                <td>{post.content.substring(0, 100)}...</td>
                <td className={post.isPublished ? "text-success" : "text-danger"}>
                    {post.isPublished ? "Published" : "Draft"}
                </td>
                <td className="text-center">
                    <div className="d-flex flex-column align-items-center gap-1">
                        <Button
                            variant="info"
                            onClick={() => navigate(`/posts/${post._id}`)}
                        >
                            View
                        </Button>
                        <Button
                            variant="warning"
                            onClick={() => navigate(`/posts/update/${post._id}`)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleDeleteClick(post._id)}
                        >
                            Delete
                        </Button>
                    </div>
                </td>
            </tr>
        )));
    }, [blogData]);

    return (
        <div className="admin-dashboard-container my-5">
            <h1 className="text-center my-4">Admin Dashboard</h1>
            <div className="d-flex justify-content-center gap-3 mb-4">
                <Button variant="primary" onClick={() => navigate("/addpost")}>
                    Add Blog Post
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Content Preview</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{blogPosts}</tbody>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
