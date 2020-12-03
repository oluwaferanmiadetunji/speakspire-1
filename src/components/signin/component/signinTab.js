import React from 'react';
import './signinTab.scss';
import SigninInput from '../subcomponents/signinInputs';
import close from '../../../assets/close.svg';
import userLogo from '../assets/userLogo.svg';
import envelope from '../assets/envelope.svg';

import {withRouter} from 'react-router-dom';

function signintab({history}) {
	const parameters = new URLSearchParams(window.location.search); 
	const username = parameters.get('verified');
	return (
		<div className='signintab'>
			<img className='signintab__close' src={close} alt='close button' onClick={() => history.goBack()} />
			{
				(!username)?(
					<img className='signintab__sideimage' src={userLogo} alt='userLogo' />
				):
				(
					<div className="signintab__mailcontent">
						<img src={envelope} alt=""/>
						<div className="signintab__mailcontent__header">
							Email Confirmed
						</div>
						<div className="signintab__mailcontent__text">
						Hello <span>{username}</span>! Thank you for verifying your email. Your sign up is now complete.
						</div>
					</div>
				)
			}
			<div className='signininputcomponent'>
				<SigninInput />
			</div>
		</div>
	);
}

export default withRouter(signintab);
