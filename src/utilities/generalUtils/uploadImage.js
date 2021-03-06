import axios from '../axios';

export default async (image) => {
	const formData = await new FormData();
	formData.append('file', image);
	let link;
	try {
		const response = await axios.post('/upload', formData);
		console.log(response.data.data);
		link = response.data.data;
	} catch (err) {
		console.log(err);
		link = '';
	}

	return link;
};

export const uploadSpeakerImage = async(image, id) => {
	const formData = await new FormData();
	formData.append('cover_photo', image);
	let link;
	try {
		const response = await axios.post(`/speakers/${id}/photo/cover`, formData);
		console.log(response.data.data);
		link = response.data.data;
	} catch (err) {
		console.log(err);
		link = '';
	}

	return link;
}

export const uploadOrganiserImage = async(image, id) => {
	const formData = await new FormData();
	formData.append('cover_photo', image);
	let link;
	try {
		const response = await axios.post(`/organizers/${id}/photo/cover`, formData);
		console.log(response.data.data);
		link = response.data.data;
	} catch (err) {
		console.log(err);
		link = '';
	}

	return link;
}

export const uploadOrganiserProfile = async(image, id) => {
	const formData = await new FormData();
	formData.append('profile_photo', image);
	let link;
	try {
		const response = await axios.post(`/organizers/${id}/photo/profile`, formData);
		console.log(response.data.data);
		link = response.data.data;
	} catch (err) {
		console.log(err);
		link = '';
	}

	return link;
}

export const uploadSpeakerCover = async(image, id) => {
	const formData = await new FormData();
	formData.append('profile_photo', image);
	let link;
	try {
		const response = await axios.post(`/speakers/${id}/photo/profile`, formData);
		console.log(response.data.data);
		link = response.data.data;
	} catch (err) {
		console.log(err);
		link = '';
	}

	return link;
}


export const uploadEventsCover = async(image, eventId, organiserId) => {
	const formData = await new FormData();
	formData.append('file', image);
	let link;
	try {
		// get the link
		const {data:{data}} = await axios.post('/upload', formData);
		// post the banner
		await axios.patch(`/events/${eventId}/banner`, {
			"banner": data,
			"organizer_id": `${organiserId}`
		});

		link = data;
	} catch (err) {
		console.log(err);
		link = '';
	}

	return link;
}