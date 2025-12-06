import toast from "react-hot-toast";

export const validateImageFile = (file, inputElement) => {
	if (!file) return null;

	// Validate file type
	const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
	if (!validTypes.includes(file.type)) {
		toast.error('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
		if (inputElement) inputElement.value = '';
		return null;
	}
	
	// Validate file size (max 5MB)
	const maxSize = 5 * 1024 * 1024; // 5MB in bytes
	if (file.size > maxSize) {
		toast.error('Image size must be less than 5MB');
		if (inputElement) inputElement.value = '';
		return null;
	}

	return file;
};

export const readFileAsBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};
