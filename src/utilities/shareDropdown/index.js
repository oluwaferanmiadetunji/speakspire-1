import React from 'react';
import "./shareDropdown.scss";
import { message, Menu } from 'antd';
import { useSelector } from 'react-redux';

import ShareIcon from './assets/shareIcon.svg';
import {
    RenderInstagramIcon, RenderLinkedInIcon,
    RenderTwitterInIcon, RenderFacebookIcon
} from './svgs'


export default function ({closed, onClose}) {
    const user = useSelector(({user}) => user);
    const {id, role} = user;
    let url = window.location.href;
    const roleMap = {
        speaker: "speakers",
        organizer: "organiserprofile"
    }

    if(url.indexOf('profile') !== -1){
        url = `http://speakspire.com/${roleMap[role]}/${id}`;
    }


    function shareFacebook(){
        var totalurl = encodeURIComponent(url);
        
        window.open ('http://www.facebook.com/sharer.php?u='+totalurl,'','width=500, height=500, scrollbars=yes, resizable=no');
        
    }

    function shareTwitter(){
        const text='Check us out  at speakspire';
        const totalurl = `http://twitter.com/share?text=${text}&url=${url}&hashtags=#events,#speakers,#speakspire`
        window.open(totalurl, '','width=500, height=500, scrollbars=yes, resizable=no')
    }

    function shareLinkedin(){
        const title = 'Speakspire';
        const summary = 'Check us out at Speakspire';
        const totalurl = `https://www.linkedin.com/shareArticle?url=${url}&title=${title}&summary=${summary}&source=LinkedIn`;
        window.open(totalurl, '','width=500, height=500, scrollbars=yes, resizable=no')

    }

    const copyToClipboard = () => {
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        message.success("Copied profile link to clipboard");
    };



    return (
        <div
            style={closed? {"display": "none"}: {"display":"flex"}}
            className="shareuser"
        >
            <Menu className = "navigation-dropdown">
                <div className="dropdown-header">
                    <div className="dropdown-content__image">
                        <img src={ShareIcon} alt=""/>
                    </div>
                    Share on:
                </div>
                <div
                    className="dropdown-content"
                    onClick={shareLinkedin}
                >
                    <div className="dropdown-content__image">
                        <RenderLinkedInIcon />
                    </div>
                    LinkedIn
                </div>
                <div
                    className="dropdown-content"
                    onClick = {shareTwitter}
                >
                    <div className="dropdown-content__image">
                        <RenderTwitterInIcon />
                    </div>
                    Twitter
                </div>
                <div
                    className="dropdown-content"
                    onClick={shareFacebook}
                >
                    <div className="dropdown-content__image">
                        <RenderFacebookIcon />
                    </div>
                    Facebook
                </div>
                <div
                    className="dropdown-content"
                    onClick = {copyToClipboard}
                >
                    <div className="dropdown-content__image">
                        <RenderInstagramIcon />
                    </div>
                    Copy Link
                </div>
            </Menu>
        </div>
    )
}

