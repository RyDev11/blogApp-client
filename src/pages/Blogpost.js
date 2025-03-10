import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import { Container, Row, Col } from "react-bootstrap";
import BlogPostCard from "../components/BlogPostCard";
import AdminDashboard from "../components/AdminDashboard";

export default function BlogPost() {
  const { user } = useContext(UserContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch all blog posts
  const fetchData = async () => {
    setLoading(true);
    setError("");

    const fetchUrl = `${process.env.REACT_APP_API_BASE_URL}/posts/all`;

    try {
      const res = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("Fetched Data:", data); // Debugging output

      if (Array.isArray(data)) {
        setBlogPosts(data);
      } else {
        setBlogPosts([]);
        setError(data.message || "No blog posts found.");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts([]);
      setError("Failed to load blog posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {user.isAdmin ? (
        <AdminDashboard blogData={blogPosts} fetchData={fetchData} />
      ) : (
        <Container className="my-4 text-center">
          <h1>Latest Blog Posts</h1>

          {loading ? (
            <p>Loading blog posts...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : blogPosts.length > 0 ? (
            <Row className="g-4 mt-4">
              {blogPosts.map((post) => (
                <Col key={post._id} xs={12} md={6} lg={4}>
                  <BlogPostCard postProp={post} />
                </Col>
              ))}
            </Row>
          ) : (
            <p>No blog posts available.</p>
          )}
        </Container>
      )}
    </>
  );
}
