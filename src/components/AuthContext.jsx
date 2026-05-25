import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch, setSessionExpiredHandler } from "../lib/api";

const AuthContext = createContext(null);
const USER_STORAGE_KEY = "techtrade_user";

const readStoredUser = () => {
	try {
		const raw = localStorage.getItem(USER_STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

const writeStoredUser = (userData) => {
	if (userData) {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
	} else {
		localStorage.removeItem(USER_STORAGE_KEY);
	}
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuthStatus = useCallback(async () => {
		try {
			const response = await apiFetch("/models/validation/auth_check.php", {
				method: "GET",
				headers: { Accept: "application/json" },
			});

			const data = await response.json();

			if (response.ok && data.status === "authenticated" && data.user) {
				setUser(data.user);
				writeStoredUser(data.user);
			} else {
				setUser(null);
				writeStoredUser(null);
			}
		} catch (error) {
			console.error("System configuration verification failed:", error);
			setUser(null);
			writeStoredUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		checkAuthStatus();
	}, [checkAuthStatus]);

	useEffect(() => {
		setSessionExpiredHandler(() => {
			setUser(null);
			writeStoredUser(null);
			localStorage.removeItem("user_role");
		});
		return () => setSessionExpiredHandler(null);
	}, []);

	const loginContext = (userData) => {
		setUser(userData);
		writeStoredUser(userData);
		if (userData?.roleId != null) {
			localStorage.setItem("user_role", String(userData.roleId));
		}
	};

	const logoutContext = async () => {
		try {
			await apiFetch("/authentication/logout.php", { method: "POST" });
		} catch (error) {
			console.error("Logout request failed:", error);
		} finally {
			setUser(null);
			writeStoredUser(null);
			localStorage.removeItem("user_role");
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				loginContext,
				logoutContext,
				refreshAuth: checkAuthStatus,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error(
			"useAuth must be run inside an explicit AuthProvider matrix.",
		);
	return context;
};
