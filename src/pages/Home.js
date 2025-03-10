import Banner from "../components/Banner";

import { Container } from "react-bootstrap";



export default function Home(){
	const data = {
	    title: "Welcome to CodeChronicles",
	    content: "Explore insightful blogs and share your journey in software development.",
	    destination: "/posts",
	    buttonLabel: "Read Blogs"
	};

	return(
		<>	
			<Container className="mb-5 mt-5">
			<Banner data={data} />

			</Container>
		</>
	)
}