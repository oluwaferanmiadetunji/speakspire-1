import React, { useEffect, useState } from 'react';
import { component as NavBar } from '../../../utilities/navbar';
import ProfileCard from '../subcomponents/profileCard';
import ProfileContent from '../subcomponents/profileContent';
import { component as Footer } from '../../../utilities/footer';
// import a sample image
import tempHeaderImage from '../assets/temp header.jpg';
import axios from '../../../utilities/axios';
import './speakerprofile.scss';

export default function Speakerprofile(props) {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const getDetails = async () => {
			try {
				const { data } = await axios.get(`/speakers/${props.match.params.id}`);
				setUserData(data.data);
				console.log(data.data);
			} catch (err) {
				console.log(err);
				setUserData({});
			}
		};
		getDetails();
	}, [props.match.params.id]);
	return (
		<div class='speakerprofile'>
			{/* the navigation bar of the site */}
			<NavBar />
			{/* the navigation bar of the site */}

			{/* the section for the image header */}
			<div className='speakerprofile__header_image'>
				<img src={tempHeaderImage} alt='' />
			</div>
			{/* the section for the image header */}

			{/* the section containing the profilecard */}
			<div className='speakerprofile__profile_card'>
				<ProfileCard userData={userData} />
			</div>
			{/* the section containing the profilecard */}

			{/* the section containing the main content */}
			<div className='speakerprofile__profile_content'>
				<ProfileContent userData={userData} />
			</div>
			{/* the section containing the main content */}
			{/* the footer */}
			<Footer />
			{/* the footer */}
		</div>
	);
}