import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Menu, Dropdown, Button, message, Tooltip } from 'antd';
import profilePicturePlaceholder from '../assets/avatarplaceholder.svg';
import downArrowActive from '../assets/downArrowActive.svg';
import downArrowNeutral from '../assets/downArrowNeutral.svg';
import { Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from '../../../utilities/axios';
import {setUserData} from '../../../redux/userSlice';

import Logo from '../assets/Logo.svg';
import { setLoggedIn, setLoggedOut } from '../../../redux/userSlice';

import { fetchAllSpeakers } from '../../../redux/speakerSlice';
import { fetchAllEvents } from '../../../redux/eventSlice';
import { fetchAllOrganizers } from '../../../redux/organiserSlice';

import { useDispatch, useSelector } from 'react-redux';
import { getToken, setToken, getUser, getRole, getID } from '../../../api/user';

import profile from '../assets/profile.svg';
import {
	RenderProfileIcon, RenderEventIcon,
	RenderFavouriteIcon, RenderLogOuticon
} from './svgs'
import './navbar.scss';



const MENU_ITEMS = [
	{ text: 'Speakers', link: '/speakers' },
	{ text: 'Organizers', link: '/organisers' },
	{ text: 'Events', link: '/events' },
	{ text: 'Blog', link: '' },
	{ text: 'About Us', link: '/about' },
];

export default function Navbar() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [isHovered, setIsHovered] = useState(false);
	const [userDetails, setUserDetails] = useState(null);
	const userRole = useSelector(({user}) => user.role);

	const goTo = (path) => {
		history.push(path)
	}

	function toggleHover() {
		setIsHovered(!isHovered);
	}

	useEffect(() => {
		// fetch all speakers
		dispatch(fetchAllSpeakers());
		// fetch all events
		dispatch(fetchAllEvents());
		// fetch all organisers
		dispatch(fetchAllOrganizers());

		const foundSession = getToken();
		const role = getRole();
		if (foundSession) {
			// if(role === '')
			if(role === 'speaker'){
				const userDetails = getUser().user_id
				axios.get(`/speakers/${userDetails.id}`).then(({data}) => {
					dispatch(setUserData(data.data))
				}).catch(err => {
					console.log('there was an error fetching user details');
				})
			}else if(role === 'organizer'){
				const userDetails = getUser().user_id
				axios.get(`/organizers/${userDetails.id}`).then(({data}) => {
					dispatch(setUserData(data.data))
				}).catch(err => {
					console.log('there was an error fetching user details');
				})	
			}
			dispatch(setLoggedIn({
				role: getRole(),
				id: getID()
			}));
		}
	}, [dispatch]);
	const signOut = () => {
		sessionStorage.clear();
		message.success('Logout sucessfull');
		setTimeout(() => {
			history.push('/')
			dispatch(setLoggedOut());
		}, 1000);
	};

	const sendMail = () =>{
		
	}
	const menu = (
		<Menu className = "navigation-dropdown" >
			{
				(userRole !== 'individual') &&
				<div className="dropdown-content dropdown-content-navigation" onClick={() => goTo('/profile')}>
					<div className="dropdown-content__image">
						<RenderProfileIcon/>
					</div>
					Profile
				</div>

			}
			{/* <div className="dropdown-content" onClick={() => goTo('/events')}> */}
			<div className="dropdown-content" onClick={() => sendMail()}>
				<div className="dropdown-content__image">
					<RenderEventIcon />
				</div>
				Events
			</div>
			<div className="dropdown-content" onClick={() => goTo('/favourites')}>
				<div className="dropdown-content__image">
					<RenderFavouriteIcon />
				</div>
				Favorites
			</div>
			<div className="dropdown-content" onClick={signOut}>
				<div className="dropdown-content__image">
					<RenderLogOuticon />
				</div>
				Logout
			</div>
		</Menu>
	);

	const userState = useSelector(({ user }) => user);
	return (
		<div>
			<div className='navigation'>
				<Link className='link' to='/'>
					<div className='navigation__logo'>
						<img src={Logo} alt='Speakspire Logo' />
					</div>
				</Link>

				<div className='navigation__menu'>
					{MENU_ITEMS.map((menuItem, i) => (
						<Link className='link' to={menuItem.link} key={i}>
							<div className='navigation__menu__item --item'>{menuItem.text}</div>
						</Link>
					))}

					{!userState.loggedIn ? (
						<>
							<Link className='link' to='/login'>
								<div className='navigation__menu__item --outlinedbutton'> Sign In </div>
							</Link>

							<Link className='link' to='/category'>
								<div className='navigation__menu__item --filledbutton'> Sign Up</div>
							</Link>
						</>
					) : (
						<>
							<Dropdown overlay={menu} placement='bottomCenter'>
								<div className='profilepicture__container' onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
									<img className='profilepicture' src={userState?.user?.profile_photo || profilePicturePlaceholder} alt='' />
									<img className='arrow' src={!isHovered ? downArrowNeutral : downArrowActive} alt='' />
								</div>
							</Dropdown>
							<Link className='link' to='/registerevent'>
								<div className='navigation__menu__item --outlinedbutton'> Add Event </div>
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
