import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function AddBlogPost() {
    const notyf = new Notyf();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // Input states
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function createBlogPost(e) {
        e.preventDefault();

        const token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/add`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Post Creation Response:", data);

            if (data.message === "Post created successfully") {
                notyf.success("Blog Post Added");
                setTitle("");
                setContent("");

               
                if (data.post && data.post._id) {
                    navigate(`/posts/${data.post._id}`);
                } else {
                    navigate("/posts"); // Fallback if no ID is returned
                }
            } else {
                notyf.error(data.message || "Post creation failed");
            }
        })
        .catch(() => {
            notyf.error("Post creation request failed");
        });
    }


    return (
        <div className="add-blog-container mx-auto mt-5 mb-5">
            <h1 className="my-5 text-center">Add Blog Post</h1>
            <Form onSubmit={createBlogPost}>
                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Content:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Enter Blog Content"
                        required
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="my-5">Add Blog Post</Button>
                <Button variant="secondary" type="button" className="my-5 mx-2" onClick={() => navigate("/posts")}>Cancel</Button>
            </Form>
        </div>
    );
}
