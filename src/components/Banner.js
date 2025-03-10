import { Row, Col, Button } from "react-bootstrap"
import { Link } from 'react-router-dom';

export default function Banner({data}){

	console.log(data);
    const {title, content, destination, buttonLabel} = data;

	return(

		<Row className="banner-container d-flex justify-content-center align-items-center">
    		<Col xs={12} md={8} lg={6} className="text-center">
        		<h1>{title}</h1>
        		<p>{content}</p>
        		<Button variant="primary" className="banner-button" as={Link} to={destination}>{buttonLabel}</Button>
   			 </Col>
</Row>


	)
}