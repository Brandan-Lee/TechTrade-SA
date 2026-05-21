import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuthStatus = async () => {
		try {
			const response = await fetch(
				"http://localhost/techtrade_api/models/validation/auth_check.php",
				{
					method: "GET",
					headers: { Accept: "application/json" },
					credentials: "include",
				},
			);

			const data = await response.json();

			if (response.ok && data.status === "authenticated") {
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("System configuration verification failed:", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const loginContext = (userData) => {
		setUser(userData);
	};

	const logoutContext = () => {
		setUser(null);
		// You can fire an optional logout payload request endpoint here to wipe cookies
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
