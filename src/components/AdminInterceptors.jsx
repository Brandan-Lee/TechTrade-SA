import React, { useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";

const AdminInterceptors = ({ openLogin }) => {
	const location = useLocation();

	const isVerified = location.state?.authenticated === true;
	const userRole = localStorage.getItem("user_role") || location.state?.role;

	const ADMIN_ROLES = ["admin", "moderator", "4", "3"];
	const hasAdminPrivileges = ADMIN_ROLES.includes(String(userRole));

	useEffect(() => {
		if (!isVerified) {
			openLogin();
		}
	}, [openLogin, isVerified]);

	if (isVerified && !hasAdminPrivileges) {
		console.warn("Access Denied: Insufficient security clearance privileges.");
		return (
			<Navigate
				to="/"
				replace
				state={{ message: "Unauthorized access attempt." }}
			/>
		);
	}

	if (isVerified && hasAdminPrivileges) {
		return <Outlet />;
	}

	window.history.replaceState({}, document.title);

	return <Navigate to="/" replace state={{ fromAdmin: true }} />;
};

export default AdminInterceptors;
