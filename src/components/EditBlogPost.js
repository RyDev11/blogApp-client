import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function UpdatePost() {
    const { user } = useContext(UserContext);
    const { id } = useParams(); // Get post ID from URL
    const navigate = useNavigate();
    const notyf = new Notyf();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Fetch existing post details
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Fetched Post Data:", data); 
                if (data && data.title && data.content) {
                    setTitle(data.title);
                    setContent(data.content);
                } else {
                    notyf.error("Post not found or unauthorized");
                    navigate("/posts");
                }
            })
            .catch(() => {
                notyf.error("Failed to fetch post");
                navigate("/posts");
            });
    }, [id, navigate]);

    function handleUpdate(e) {
        e.preventDefault();

        const token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/update/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Update Response:", data);

            if (data.success) {
                notyf.success("Post updated successfully");
                navigate(`/posts/${id}`);
            } else {
                notyf.error(data.message || "Update failed");
            }
        })
        .catch(() => notyf.error("Update request failed"));
    }

    return (
        <div className="update-post-container mx-auto mt-5 mb-5">
            <h1 className="text-center">Edit Blog Post</h1>
            <Form onSubmit={handleUpdate}>
                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Content:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="my-3">Update Post</Button>
                <Button variant="secondary" className="my-3 mx-2" onClick={() => navigate(`/posts/${id}`)}>Cancel</Button>
            </Form>
        </div>
    );
}
