// Dev defaults to the Vite proxy so PHP session cookies (PHPSESSID) are same-origin.
// Direct http://localhost/techtrade_api breaks cookies across :5173 ↔ :80.
export const API_BASE =
	import.meta.env.VITE_API_BASE_URL ?? "/techtrade_api";

export const apiUrl = (path) => {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE}${normalized}`;
};

export const mediaUrl = (path) => {
	if (!path) return "";
	if (/^https?:\/\//i.test(path)) return path;
	const normalized = path.replace(/^\/+/, "");
	return apiUrl(`/${normalized}`);
};

let onSessionExpired = null;

export const setSessionExpiredHandler = (handler) => {
	onSessionExpired = handler;
};

export const apiFetch = async (path, options = {}) => {
	const response = await fetch(apiUrl(path), {
		credentials: "include",
		...options,
	});

	if (response.status === 401 && onSessionExpired) {
		onSessionExpired();
	}

	return response;
};
