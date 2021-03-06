import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { INITIAL_STATE } from './constants';
import { component as NavBar } from '../../../utilities/navbar';
import validateEmail from '../../../utilities/generalUtils/validation';
import PasswordStrengthBar from 'react-password-strength-bar';

import { Spin } from 'antd';
import { message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import axios from '../../../utilities/axios';
import notificationIcon from '../assets/notification.svg';
import { setMail } from '../../../api/user';
import './usersignup.scss';

const antIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

export default function Userdetails() {
	let history = useHistory();
	const dispatch = useDispatch();

	const [passwordHidden, setPasswordHidden] = useState(true);
	const [loading, setLoading] = useState(false);

	const [state, stateChanger] = useState(INITIAL_STATE);
	const handleFormChange = (event) => {
		const { name, value } = event.target;
		stateChanger({
			...state,
			[name]: value,
		});
	};

	const validateFields = () => {
		if (state.name.length < 6) {
			message.error('Please enter a username longer than 6 characters');
			return false;
		} else if (state.password.length < 6) {
			message.error('Please enter a password longer than 6 characters');
			return false;
		} else if (!validateEmail(state.email)) {
			message.error('please enter a valid email address');
			return false;
		} else {
			return true;
		}
	};

	const saveUserdetails = (event) => {
		if (loading) {
			return;
		}
		if (!validateFields()) {
			return;
		}
		setLoading(true);
		// save the details to axios using a post request
		axios
			.post('/individuals/add', state)
			.then((res) => {
				setMail(state.email);
				setTimeout(() => {
					history.push('/confirm');
				}, 500);
			})
			.catch((err) => {
				const errorMessage = err.response?.data?.message?.email;
				const defaultMessage = 'There was an error creating your account, Please try again.';
				message.error(errorMessage || defaultMessage);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<>
			<NavBar />
			<div className='userdetails__wrapper'>
				<div className='userdetails'>
					<div className='userdetails__heading'>
						<div className='userdetails__heading__header'>Personal Details</div>
						<div className='userdetails__heading__subheading'>
							Not an individual? <span onClick={() => history.push('/category')}>Choose another account type</span>
						</div>
					</div>

					<div className='userdetails__formsection'>
						{/* wrapepr for the name */}
						<div className='--wrapper'>
							<label htmlFor='name'>Full Name *</label>
							<input maxLength='30' type='text' id='name' name='name' onChange={handleFormChange} value={state.name} placeholder='Enter full name' />
						</div>
						{/* wrapepr for the name */}

						{/* wrapper for the email */}
						<div className='--wrapper'>
							<label htmlFor='email'>Email *</label>
							<input type='email' id='email' name='email' placeholder='Enter your email' onChange={handleFormChange} value={state.email} />
						</div>
						{/* wrapper for the email */}

						{/* wrapper for you password */}
						<div className='--wrapper'>
							<label htmlFor='password'> Password *</label>
							<div className='--passwordinput'>
								<input
									placeholder='6+ Characters'
									type={passwordHidden ? 'password' : 'text'}
									name='password'
									id='password'
									value={state.password}
									onChange={handleFormChange}
								/>
								<i
									className={passwordHidden ? 'far fa-eye' : 'fa fa-eye-slash'}
									id='togglePassword'
									onClick={() => setPasswordHidden(!passwordHidden)}
								/>
							</div>
							<div className="--passwordstrengthbarwrapper">
								<PasswordStrengthBar password={state.password} />
							</div>
						</div>
						{/* wrapper for you password */}
					</div>

					<div className='userdetails__footer'>
						<div className='--notification'>
							<img src={notificationIcon} alt='' />
							<div className='--text'>
								By creating an account you agree to the
								<span> Terms and Conditions</span> and our <span>Privacy Policy</span>
							</div>
						</div>
						<div className='--button_group'>
							<Link className='link' to='/'>
								<div className='cancel'>Cancel</div>
							</Link>

							<Link onClick={saveUserdetails} className='link'>
								<div className='next'>{loading ? <Spin indicator={antIcon} /> : 'Create My Account'}</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
