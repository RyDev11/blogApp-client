import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BlogPostCard({ postProp }) {
    BlogPostCard.propTypes = {
        postProp: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            author: PropTypes.shape({
                username: PropTypes.string.isRequired
            }).isRequired,
            comments: PropTypes.array
        })
    };

    const { _id, title, content, author, comments } = postProp;

    // Set a single default image for all blog posts
    const imagePath = "/images/blog-card-image.jpg";  

   return (
       <Card className="blog-card text-center shadow-lg mx-3 my-3 border-0 rounded-0" 
           style={{ width: "100%", minHeight: "350px", border: "1px solid #ddd", borderRadius: "10px" }}>
           <Card.Img 
               variant="top" 
               src={imagePath} 
               alt="Blog Thumbnail" 
               className="blog-card-image"
           />
           <Card.Body className="blog-card-body d-flex flex-column justify-content-center align-items-center">
               <Card.Title>
                   <Link to={`/posts/${_id}`} className="blog-card-title text-dark text-decoration-none">
                       {title}
                   </Link>
               </Card.Title>
               <Card.Text className="blog-card-author">Author: {author.username} </Card.Text>
               <Card.Text className="blog-card-content">{content.substring(0, 100)}...</Card.Text>
               <Card.Text className="blog-card-comments">{comments.length} Comments</Card.Text>

               <Button as={Link} to={`/posts/${_id}`} variant="primary" className="blog-card-button mt-2">
                   Read More
               </Button>
           </Card.Body>
       </Card>
   );
}
