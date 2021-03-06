import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, message } from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin, Button, Upload, Tooltip} from 'antd';
import ImgCrop from 'antd-img-crop';


import Popup from '../../../../utilities/popup/index';
import UpdateUsp from '../../../../utilities/updates/speakerUspUpdates';
import UpdateBio from '../../../../utilities/updates/speakerBioUpdates';
import UpdateMedia from '../../../../utilities/updates/speakerMediaUpdate';
import UpdateTopics from '../../../../utilities/updates/speakerTopicUpdate';
import UpdateTalks from '../../../../utilities/updates/speakerTalkUpdate';
import UpdatePub from '../../../../utilities/updates/speakerUpdatePublications';
import UpdatePos from '../../../../utilities/updates/speakerPositionUpdates';
import UpdateEdu from '../../../../utilities/updates/speakerEducationUpdates';
import UpdateCert from '../../../../utilities/updates/speakerCertificationUpdates';

import { classifySpeaker } from '../../../../utilities/utils';
import uploadImage from '../../../../utilities/generalUtils/uploadImage';

import UploadImage from '../../assets/upload.svg'
import Delete from '../../assets/delete.svg'
import HorizontalSpeaker from '../../subcomponents/horizontalSpeaker';
import profileSample from '../../assets/potrait.jpg';
import instagram from '../../assets/instagram.svg';
import linkedin from '../../assets/linkedin.svg';
import twitter from '../../assets/twitter.svg';
import facebook from '../../assets/facebook.svg';
import web from '../../assets/web.svg';

import noPublicationIcon from '../../assets/publicationsnone.svg';
import noTalksIcon from '../../assets/talksnone.svg';

import axios from '../../../../utilities/axios';
import './profileContent.scss';
import bluePencilIcon from '../../assets/pencil.svg';
import { act } from '@testing-library/react';

const imageLoadingIcon = <LoadingOutlined style={{fontSize: 20, color: '#4D75F4'}} spin />;
const whiteLoadingIcon = <LoadingOutlined style={{fontSize: 24, color: '#fff'}} spin />;
const { TabPane } = Tabs;

const getLink = (allLinks, linkType) => {
	try{
		return (JSON.parse(allLinks) || []).find(oneLink => oneLink.includes(linkType))
	}catch(err){
		return ""
	}
}


const More = ({text}) => <div className='more'>{text || 'More'}...</div>;

const SpeakingSkills = ({ primaryTopic, primarySkills, secondaryTopic, secondarySkills }) => (
	<>
		{/* primary skills bar */}
		<div className='profilecontent__left__speaking__tab_content'>
			<div className='tab_content_heading'>PRIMARY</div>
			<div className='tab_content_subheading'>{primaryTopic}</div>
			<div className='tab_content_content'>
				{primarySkills.map((skill, i) => (
					<div className='skillitem' key={i}>
						{skill}
					</div>
				))}
				{/* <More /> */}
			</div>
		</div>
		{/* secondary skills bar */}

		{/* primary skills bar */}
		<div className='profilecontent__left__speaking__tab_content'>
			<div className='tab_content_heading'>SECONDARY</div>
			<div className='tab_content_subheading'>{secondaryTopic}</div>
			<div className='tab_content_content'>
				{secondarySkills.map((skill, i) => (
					<div className='skillitem' key={i}>
						{skill}
					</div>
				))}
				{/* <More /> */}
			</div>
		</div>
	</>
);

const filterData = (array, params) => {
	return array.filter((data) => data.category === params);
};

export default function ProfileContent({userData, isAdmin, refetch }) {
	const [loading, setLoading] = useState(false);
	const [editField, setEditField] = useState(false);
	const [positionsLimit, setPositionsLimit] = useState(2);
	const [educationsLimit, setEducationsLimit] = useState(2);
	const [certificatesLimit, setcertificatesLimit] = useState(2);
	const [pictureLimit, setPictureLimit] = useState(2);
	const [videoLimit, setVideoLimit] = useState(2);
	const [presentationLimit, setPresentationLimit] = useState(2);
	const [talksLimit, setTalksLimit] = useState(2);
	const [publicationsLimit, setPublicationsLimit] = useState(2);
	const [popupClosed, setClosePopup] = useState(true);
	const [mediaState, setMediaState] = useState([]);
	const [activeMediaTab, setActiveMediaTab] = useState({
		activeTab: 1,
		edit: false
	});
	const [allTalks, setAllTalks] = useState([]);
	const [allPublications, setAllPublications] = useState([]);
	const [activeTalkTab, setactiveTalkTab] = useState(1);
	const [positionsTab, setPositionsTab] = useState(1);
	const [randomId, setRandomId] = useState(0);

	const [mediaLoading, setMediaLoading] = useState(false);
	const FileImage = () => <img height='14px' style={{'marginRight': '10px'}} src={UploadImage} alt='calendar' />;

	const { expertise, bio, experience, education, certification, media, usp, links } = userData;
	const speakers = useSelector(({ speakers }) => speakers.data);
	const speakersList = speakers || [];

	const SOCIAL_MEDIA_ICONS = [[instagram, getLink(links, 'instagram')], [linkedin, getLink(links, 'linkedin')], [twitter, getLink(links, 'twitter')], [facebook, getLink(links, 'facebook')], [web, getLink(links, 'www')]];

	const EditIcon = () => (
		isAdmin &&
		<div className='editicon'>
			<img src={bluePencilIcon} alt='' />
		</div>
	);
	const userID = useSelector(({user}) => user.id);

	const showMediaEditItems = (tab) => {
		return activeMediaTab.edit && `${activeMediaTab.activeTab}` === `${tab}`
	}

	useEffect(() => {
		const tempRandomId = parseInt(Math.random() * speakersList.length);
		setRandomId(tempRandomId)
	},[speakersList])
	
	useEffect(() => {
		if(!userData) return;
		const {
			talks, publications
		} = userData
		setAllPublications(publications || []);
		setAllTalks(talks || []);
	}, [userData])

	useEffect(() => {
		setMediaState(media);
	}, [media])

	const AddMedia = (link, category) => {
		setMediaState([
			...mediaState,
			{
				link,
				category
			}
		]);
	}

	const removeMedia = (link) => {
		setMediaState(
			mediaState.filter(ms => ms.link!==link)
		)
	}
	
	const topicTalkEditTabs = ["","topicArea", "talks", "publications"];
	const positionsEditTabs = ["","position", "education", "certifications"];
	const componentUpdateMap = {
		why: <UpdateUsp
				initialData={{usp}}
				onClose={() => setClosePopup(true)}
				onSuccess={refetch}
			/>,
		bio: <UpdateBio
				initialData={{bio}}
				onClose={() => setClosePopup(true)}
				onSuccess={refetch}
			/>,
		socials: <UpdateMedia
			initialData={{links}}
			onClose={() => setClosePopup(true)}
			onSuccess={refetch}
		/>,
		talks: <UpdateTalks
			initialData={allTalks}
			onClose={() => setClosePopup(true)}
			onSuccess={refetch}
		/>,
		publications: <UpdatePub
			initialData={allPublications}
			onClose={() => setClosePopup(true)}
			onSuccess={refetch}
		/>,
		position: <UpdatePos
			initialData={experience}
			onClose={() => setClosePopup(true)}
			onSuccess={refetch}
		/>,
		certifications: <UpdateCert
			initialData={certification}
			onClose={() => setClosePopup(true)}
			onSuccess={refetch}
		/>,
		education: <UpdateEdu
			initialData={education}
			onClose={() => setClosePopup(true)}
			onSuccess={refetch}
		/>,
		topicArea: <UpdateTopics
			initialData={{
				primarySpecialty: expertise ? expertise[0].primary_specialty : "",
				secondarySpecialty: expertise ? expertise[0].secondary_specialty : "",
				primaryTopic: expertise && expertise[0]?.primary_topic,
				primarySkills: expertise ? JSON.parse(expertise[0]?.primary_tags || {}) : [],
				secondaryTopic: expertise && expertise[0]?.secondary_topic,
				secondarySkills: expertise ? JSON.parse(expertise[0]?.secondary_tags || {}) : []
			}}
			onClose={() => setClosePopup(true)}
			/>,
		}
	const openEditPopup = (key) => {
		setEditField(key);
		setClosePopup(false);
	}

	const imageUploadProps = {
		name: 'file',
		onChange(info) {

		},
		beforeUpload: (file) => {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				message.error('You can only upload JPG/PNG file!');
				return;
			}
			setMediaLoading(true);
			uploadImage(file)
				.then((res) => 	AddMedia(res, "photo"))
				.catch((err) => message.error("There was an error uploading this image, please try again later"))
				.finally(()=>setMediaLoading(false));
			return false;
		},
		disabled: mediaLoading,

	};
	const videoProps = {
		name: 'file',
		onChange(info) {

		},
		beforeUpload: (file) => {
			const sizeInMb = file.size/1000000;
			if(sizeInMb > 50){
				message.error("Please upload a video file of less than 50MB");
				return;
			}
			const isMp4OrMkv = file.type === 'video/mp4' || file.type === 'video/x-matroska';
			if (!isMp4OrMkv) {
				message.error('You can only upload an MP4/MKV file!');
				return;
			}
			setMediaLoading(true);
			uploadImage(file)
				.then((res) => 	AddMedia(res, "video"))
				.catch((err) => message.error("There was an error uploading this image, please try again later"))
				.finally(()=>setMediaLoading(false));
			return false;
		},
		disabled: mediaLoading,
	};
	
	const docsProps = {
		name: 'file',
		onChange(info) {

		},
		beforeUpload: (file) => {
            const sizeInMb = file.size/1000000;
			if(sizeInMb > 50){
				message.error("Please upload a video file of less than 50MB");
				return;
            }
			const isPDF = file.type === 'application/pdf';
			if (!isPDF) {
				message.error('You can only upload a PDF file!');
				return;
			}
			setMediaLoading(true);
			uploadImage(file)
				.then((res) => AddMedia(res, "presentation"))
				.catch((err) => message.error("There was an error uploading this image, please try again later"))
				.finally(()=>setMediaLoading(false));
			return false;
		},
		disabled: mediaLoading,
	};

	const saveMedia = () =>{
		// logic about uploading images

		setLoading(true)
        axios.patch(`/speakers/${userID}/media`,{
			media: mediaState
        }).then((res) => {
            message.success("Details updated sucesfully!");
        }).catch((err) => {
            message.error("There was an error updating user!", err.response.data.message);
        }).finally(()=>{
			setActiveMediaTab({
				...activeMediaTab,
				edit: false
			});
			setLoading(false);
        })
	}

	const cancelMedia = () =>{
		setMediaState(media);
		setActiveMediaTab({
		...activeMediaTab,
		edit: false
		})
	}

	return (
		<>
			<Popup
				closed={popupClosed}
				Component={
					componentUpdateMap[editField]
				}
				onClose={
					() => setClosePopup(true)
				}
			/>
			<div className='profilecontent'>
				<div className='profilecontent__left'>
					<div className='profilecontent__left__reason'>
						<div className='--top_heading'>
							<span>Why Choose Me?</span>
							<div onClick = {() => openEditPopup('why')}>
								<EditIcon />
							</div>
						</div>
						<div className='--bottom_content'>{usp}</div>
					</div>

					{/* the section for the first tab */}
					<div className='profilecontent__left__speaking --tabs'>
						<Tabs
							defaultActiveKey='1'
							tabBarExtraContent={
								<div onClick={
									() =>{
										openEditPopup(topicTalkEditTabs[activeTalkTab])
									}
								}>
									<EditIcon />
								</div>
							}
							onChange={(active) => setactiveTalkTab(active)}
						>
							{/* the tab to upload images */}
							<TabPane tab='Topic Areas' key='1'>
								{/* topic areas content */}
								{
									expertise && expertise[0]?.primary_topic?
									(
										<SpeakingSkills
											primaryTopic={expertise && expertise[0]?.primary_topic}
											primarySkills={expertise ? JSON.parse(expertise[0]?.primary_tags || {}) : []}
											secondaryTopic={expertise && expertise[0]?.secondary_topic}
											secondarySkills={expertise ? JSON.parse(expertise[0]?.secondary_tags || {}) : []}
										/>
									):(
										<div className="noitem">
											<img src={noTalksIcon} alt="" className="noitem__image"/>
											<div className="noitem__header">No Topic Areas</div>
											{
												isAdmin && (
													<>
													<div className="noitem__textcontent">Tell people more about your area of specialty.</div>
													<div className="noitem__action"
														onClick={() => openEditPopup(topicTalkEditTabs[activeTalkTab])}
													>
														Add Topic Areas
													</div>
													</>
												)
											}
										</div>
									)
								}
								{/* topic areas content */}
							</TabPane>
							{/* the tab to upload images */}

							<TabPane tab='Past Talk' key='2'>
								{/* topic areas content */}
								{
									allTalks.length === 0? (
										<div className="noitem">
											<img src={noTalksIcon} alt="" className="noitem__image"/>
											<div className="noitem__header">No Talks</div>
											{
												isAdmin && (
													<>
													<div className="noitem__textcontent">Tell people more about where you delivered talks and what you talked about.</div>
													<div className="noitem__action"
														onClick={() => openEditPopup(topicTalkEditTabs[activeTalkTab])}
													>
														Add Past Talks
													</div>
													</>
												)
											}
										</div>
									):
									(
										<div className='experience_tab_content'>
											{
												allTalks.map(({name , location, topic, year}, index) => (
														<div key={index} className='past_experience'>
															<div className='past_experience__position'>{topic}</div>
															<div className='past_experience__company'>{name}</div>
															<div className='past_experience__date'>{`${location} ${year}`}</div>
														</div>
												))
											}
										</div>

									)
								}

								<div className='moreimages'>
									{
										allTalks && allTalks.length > talksLimit && allTalks.length > 2 && 
										<div onClick = {() => setTalksLimit(lim => lim +2)} > <More/> </div>
									}
									{
										allTalks && (allTalks.length <= talksLimit || talksLimit > 2) && allTalks.length > 2 && 
										<div onClick = {() => setTalksLimit(lim => lim - 2)} > <More text="Less"/> </div>
									}
								</div>
							</TabPane>

							<TabPane tab='Publications' key='3'>
								{/* topic areas content */}
								{
									allPublications.length === 0? (
										<div className="noitem">
											<img src={noPublicationIcon} alt="" className="noitem__image"/>
											<div className="noitem__header">No Publications</div>
											{
												isAdmin && (
													<>
													<div className="noitem__textcontent">Add books, articles, e-books and blog posts written by you.</div>
													<div className="noitem__action" onClick={() => openEditPopup(topicTalkEditTabs[activeTalkTab])}>
														Add Publications
													</div>
													</>
												)
											}
										</div>
									):(
										<div className="publication_tab_content">
												{
													allPublications.map(({type, title, link, year}, index) => (
														<div className="previous_publication">
															<div className="previous_publication__type">
																<span style={{textTransform:'capitalize'}}>{type}</span> {year}
															</div>
															<div className="previous_publication__title">
																{title}
															</div>
															<a target="_blank" href={link} rel="noopener noreferrer" className="previous_publication__link">
																View Publication
															</a>
														</div>
													))
												}
										</div>
									)
								}
								<div className='moreimages'>
									{
										allPublications && allPublications.length > publicationsLimit && allPublications.length > 2 && 
										<div onClick = {() => setPublicationsLimit(lim => lim +2)} > <More/> </div>
									}
									{
										allPublications && (allPublications.length <= publicationsLimit || publicationsLimit > 2) && allPublications.length > 2 && 
										<div onClick = {() => setPublicationsLimit(lim => lim - 2)} > <More text="Less"/> </div>
									}
								</div>
							</TabPane>
						</Tabs>
					</div>
					{/* the section for the first tab */}

					<div className='profilecontent__left__socialmedia'>
						<div className='social_content'>
							<span>Social Media</span>
							{SOCIAL_MEDIA_ICONS.map(([icon, link], i) => (
								link &&
								<img src={icon} alt='social media' key={i} onClick={() => window.open(`http://${link}`,'_blank')} />
							))}
						</div>
						<div onClick = {() => openEditPopup('socials')}>
							<EditIcon />
						</div>
					</div>

					{/* section for similar speakers */}
					<div className='profilecontent__left__similar'>
						<div className='similar_heading'> Similar Speakers</div>
						<div className='similar_speakers'>
							{speakersList.slice(randomId, randomId + 1).map((speaker, i) => {
								const {
									name, experience,
									profile_photo, id,
									expertise: [{ primary_specialty, secondary_specialty, primary_tags }],
									years_of_experience = '0-2 years', number_of_engagements = "0-10 engagements",
									languages, preferences
								} = speaker;
								const category = classifySpeaker(number_of_engagements,years_of_experience, languages)
								const [{ company, position }] = experience.length? experience : [{}]
								return (
									<HorizontalSpeaker
										id={id}
										key={i}
										category={category}
										profilePicture={profile_photo}
										fullname={name}
										position={position}
										company={company}
										primary={primary_specialty}
										preferences={preferences}
									/>
								);
							})}
						</div>
					</div>
					{/* section for similar speakers */}
				</div>
				<div className='profilecontent__right'>
					<div className='profilecontent__right__experiences --tabs'>
						<Tabs
							defaultActiveKey='1'
							onChange={ (changedKey) =>{
								setPositionsTab(changedKey);
							}}
							tabBarExtraContent={
								<div onClick={
										() =>{
											openEditPopup(positionsEditTabs[positionsTab])
										}
									}>
										<EditIcon />
								</div>
							}
						>
							{/* the tab to upload images */}
							<TabPane tab='Position' key='1'>
								<div className='experience_tab_content'>
									{experience && experience.filter(e=>e.position).length
										? experience.filter(e=>e.position).slice(0,positionsLimit).map(({ company, from, position, to }, index) => (
												<div className='past_experience' key={index}>
													<div className='past_experience__position'>{position}</div>
													<div className='past_experience__company'>{company}</div>
													<div className='past_experience__date'>{`${from} - ${to}`}</div>
												</div>
										))
										: (
											<div className="noitem">
											<img src={noPublicationIcon} alt="" className="noitem__image"/>
											<div className="noitem__header">No Position</div>
											{
												isAdmin && (
													<>
													<div className="noitem__textcontent">Add Places you have worked at and elaborate your experience.</div>
													<div className="noitem__action" onClick={() => openEditPopup(positionsEditTabs[positionsTab])}>
														Add Position
													</div>
													</>
												)
											}
										</div>
										)
										}

									<div className='moreimages'>
										{
											experience && experience.length > positionsLimit && experience.length > 2 && 
											<div onClick = {() => setPositionsLimit(lim => lim +2)} > <More/> </div>
										}
										{
											experience && (experience.length <= positionsLimit || positionsLimit > 2) && experience.length > 2 && 
											<div onClick = {() => setPositionsLimit(lim => lim - 2)} > <More text="Less"/> </div>
										}
									</div>
								</div>
							</TabPane>
							{/* the tab to upload images */}

							<TabPane tab='Education' key='2'>
								<div className='experience_tab_content'>
									{education
										? education.slice(0, educationsLimit).map(({ institution, field_of_study, from, to }, i) => (
												<div className='past_experience' key={i}>
													<div className='past_experience__position'>{institution}</div>
													<div className='past_experience__company'>{field_of_study}</div>
													<div className='past_experience__date'>{`${from} - ${to}`}</div>
												</div>
										))
										: null}

									<div className='moreimages'>
										{
											education && education.length > educationsLimit && education.length > 2 && 
											<div onClick = {() => setEducationsLimit(lim => lim +2)} > <More/> </div>
										}
										{
											education && (education.length <= educationsLimit || educationsLimit > 2) && education.length > 2 && 
											<div onClick = {() => setEducationsLimit(lim => lim - 2)} > <More text="Less"/> </div>
										}
									</div>
								</div>
							</TabPane>

							<TabPane tab='Certificates' key='3'>
								<div className='experience_tab_content'>
									{certification && certification.length && certification[0].institution
										? certification.slice(0, certificatesLimit).map(({ from, to, institution, proof, name }, i) => (
											institution &&
												<div className='past_experience' key={i}>
													<div className='past_experience__position'>{name}</div>
													<div className='past_experience__company'>{institution}</div>
													<div className='past_experience__date'>{`${from} - ${to}`}</div>
												</div>
										))
										:
										(
											<div className="noitem">
												<img src={noPublicationIcon} alt="" className="noitem__image"/>
												<div className="noitem__header">No Certifications</div>
												{
													isAdmin && (
														<>
															<div className="noitem__textcontent">Tell people more about your certificates and where you acquired them from.</div>
															<div className="noitem__action" onClick={() => openEditPopup(positionsEditTabs[positionsTab])}>
																Add Certificates
															</div>
														</>
													)
												}
											</div>
										)
									}
									<div className='moreimages'>
									{
											certification && certification.length > certificatesLimit && certification.length > 2 && 
											<div onClick = {() => setcertificatesLimit(lim => lim +2)} > <More/> </div>
										}
										{
											certification && (certification.length <= certificatesLimit || certificatesLimit > 2) && certification.length > 2 && 
											<div onClick = {() => setcertificatesLimit(lim => lim - 2)} > <More text="Less"/> </div>
										}
									</div>
								</div>
							</TabPane>
						</Tabs>
					</div>

					<div className='profilecontent__right__bio'>
						<div className='--top_heading'>
							<span>Bio</span>
							<div onClick = {() => openEditPopup('bio')}>
								<EditIcon />
							</div>
						</div>
						<div className='--bottom_content'>{bio}</div>
					</div>

					<div className='profilecontent__right__media --tabs'>
						<Tabs
							defaultActiveKey='1'
							tabBarExtraContent={
								<div onClick={() => {
									setActiveMediaTab({
										...activeMediaTab,
										edit: !activeMediaTab.edit
									})
								}}>
									<EditIcon />
								</div>
							}
							onChange={(active) => setActiveMediaTab({
								edit: false,
								activeTab: active
							})}
						>
							{/* the tab to upload images */}
							<TabPane tab='Photos' key='1'>
								<div className='image_tab_content'>
									{
										mediaState
										? filterData(mediaState, 'photo').slice(0, pictureLimit).map(({ link }, index) => (
											<div  key={index} className="media_wrapper">
												<img className="show_media" src={link} alt='' />
												{
													showMediaEditItems(1) &&
													<img
														className="delete_media"
														src={Delete} alt=''
														onClick={() => removeMedia(link)}
													/>
												}
											</div>
										))
										: null
									}
								</div>

								<div className='moreimages'>
									{
										mediaState && filterData(mediaState, 'photo').length > pictureLimit && filterData(mediaState, 'photo').length > 2 && 
										<div onClick = {() => setPictureLimit(lim => lim +2)} > <More/> </div>
									}
									{
										mediaState && (filterData(mediaState, 'photo').length <= pictureLimit || pictureLimit > 2) && filterData(mediaState, 'photo').length > 2 && 
										<div onClick = {() => setPictureLimit(lim => lim - 2)} > <More text="Less"/> </div>
									}
								</div>
								{
									showMediaEditItems(1) &&
									<div className="adminfooter">
										<ImgCrop aspect='1.49' >
											<Upload {...imageUploadProps}>
												<div className="addmedia">
													{
													(mediaLoading)?
													<Spin indicator={imageLoadingIcon} /> :
														<>
															<img src={UploadImage} alt=""/>Add Photo
														</>
													}
												</div>
											</Upload>
										</ImgCrop>
										<div className="actiongroup">
											<div
												className="cancel"
												onClick={cancelMedia}
											>
												cancel
											</div>
											<div
												className="save"
												onClick={saveMedia}
											>
											{
												loading? <Spin indicator={whiteLoadingIcon} />
												: "Save"
											}
											</div>
										</div>
									</div>
								
								}
							</TabPane>
							{/* the tab to upload images */}

							<TabPane tab='Videos' key='2'>
								<div className='image_tab_content'>
									{
										mediaState
										? filterData(mediaState, 'video').slice(0, videoLimit).map(({ link }, index) => (
											<div  key={index} className="media_wrapper">
												<video className="show_media" controls  key={index}>
													<source src={link} type="video/mp4"/>
													Your browser does not support the video tag.
												</video>
												{
													showMediaEditItems(2) &&
													<img
														className="delete_media"
														src={Delete} alt=''
														onClick={() => removeMedia(link)}
													/>
												}
											</div>	
										))
										: null
									}
								</div>
								<div className='moreimages'>
									{
										mediaState && filterData(mediaState, 'video').length > videoLimit && filterData(mediaState, 'video').length > 2 && 
										<div onClick = {() => setVideoLimit(lim => lim +2)} > <More/> </div>
									}
									{
										mediaState && (filterData(mediaState, 'video').length <= videoLimit || videoLimit > 2) && filterData(mediaState, 'video').length > 2 && 
										<div onClick = {() => setVideoLimit(lim => lim - 2)} > <More text="Less"/> </div>
									}
								</div>
								{
									showMediaEditItems(2) &&
									<div className="adminfooter">
										<Upload {...videoProps}>
											<div className="addmedia">
												{
												(mediaLoading)?
												<Spin indicator={imageLoadingIcon} /> :
													<>
														<img src={UploadImage} alt=""/>Add Video
													</>
												}
											</div>
											</Upload>
										<div className="actiongroup">
											<div
												className="cancel"
												onClick={cancelMedia}
											>
												cancel
											</div>
											<div
												className="save"
												onClick={saveMedia}
											>
												save
											</div>
										</div>
									</div>
								
								}
							</TabPane>

							<TabPane tab='Presentation' key='3'>
								<div className='image_tab_content'>
									{
										mediaState 
										? filterData(mediaState, 'presentation').slice(0, presentationLimit).map(({ link }, index) => (
											<img src={link} alt=''  key={index} />
										))
										: null
									}
								</div>
								<div className='moreimages'>
								{
										mediaState && filterData(mediaState, 'presentation').length > presentationLimit && filterData(mediaState, 'presentation').length > 2 && 
										<div onClick = {() => setPresentationLimit(lim => lim +2)} > <More/> </div>
									}
									{
										mediaState && (filterData(mediaState, 'presentation').length <= presentationLimit || presentationLimit > 2) && filterData(mediaState, 'presentation').length > 2 && 
										<div onClick = {() => setPresentationLimit(lim => lim - 2)} > <More text="Less"/> </div>
									}
								</div>
								{
									showMediaEditItems(3) &&
									<div className="adminfooter">
										<Upload {...docsProps}>
											<div className="addmedia">
												{
												(mediaLoading)?
												<Spin indicator={imageLoadingIcon} /> :
													<>
														<img src={UploadImage} alt=""/>Add Presentation
													</>
												}
											</div>
										</Upload>
										<div className="actiongroup">
											<div
												className="cancel"
												onClick={cancelMedia}
											>
												cancel
											</div>
											<div
												className="save"
												onClick={saveMedia}
											>
												save
											</div>
										</div>
									</div>
								}
							</TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		</>
	);
}

ProfileContent.propTypes = {
	reason: PropTypes.string,
	primaryTopic: PropTypes.string,
	bio: PropTypes.string,
};

ProfileContent.defaultProps = {
	reason:
		'I have served as a senior director in various capacities growing various companies and creating impact. I love sharing my experiences with unusual thinkers. ',
	primaryTopic: 'Career Development',
	primarySkills: ['Business', 'Startup Advisory', 'Growth and Customer Service', 'Startup Advisory'],
	secondaryTopic: 'Technology',
	secondarySkills: ['Business', 'Startup Advisory', 'Growth and Customer Service', 'Startup Advisory', 'Growth and Customer Service'],
	bio:
		"Don't worry, this is not also a senseless post. We estimate that 9 in 10 who read this post to the end will see meaning and value in it. Of that 9 about 5 will hit the like button; 3 will visit our profile; and 1 or less will hit the share or save button. This is a raw data set at best. The question is what do you do with this data. No! Wrong! The question is how do you make sense of this data",
};
