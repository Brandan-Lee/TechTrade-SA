const DEV_DIRECT_API = "http://localhost/techtrade_api";

export const API_BASE =
	import.meta.env.VITE_API_BASE_URL ??
	(import.meta.env.DEV ? DEV_DIRECT_API : "/techtrade_api");

export const apiUrl = (path) => {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE}${normalized}`;
};

export const apiFetch = (path, options = {}) =>
	fetch(apiUrl(path), {
		credentials: "include",
		...options,
	});
