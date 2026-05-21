import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ADMIN_ROLE_IDS = ["3", "4"];

const AdminInterceptors = ({ openLogin }) => {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();

	const isAdminUser =
		user && ADMIN_ROLE_IDS.includes(String(user.roleId));

	useEffect(() => {
		if (isLoading) return;

		if (!isAdminUser) {
			openLogin();
			navigate("/", { replace: true, state: { fromAdmin: true } });
		}
	}, [isLoading, isAdminUser, openLogin, navigate]);

	if (isLoading || !isAdminUser) {
		return null;
	}

	return <Outlet />;
};

export default AdminInterceptors;
