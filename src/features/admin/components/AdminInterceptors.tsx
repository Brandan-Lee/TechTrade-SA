import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";

const ADMIN_ROLE_IDS = ["3", "4"];

const AdminInterceptors = () => {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const hasVerifiedAdmin = useRef(false);
	const isAdminUser = user && ADMIN_ROLE_IDS.includes(String(user.roleId));

	useEffect(() => {
		if (isLoading) return;

		if (!user || !isAdminUser) {
			hasVerifiedAdmin.current = false;
			navigate("/", { replace: true, state: { fromAdmin: true } });
			return;
		}


		if (hasVerifiedAdmin.current) {
			return;
		}


		hasVerifiedAdmin.current = true;


		if (user.getLastLoginAt?.() !== null) {
			const needsMFA = !user.isMFAEnabled?.();
			const isNotAtDashboardRoot = location.pathname !== "/admin";

			if (needsMFA && isNotAtDashboardRoot) {
				navigate("/admin", { replace: true });
			}
		}
	}, [isLoading, user, isAdminUser, location.pathname, navigate]);

	if (isLoading || !user || !isAdminUser) {
		return null;
	}

	return <Outlet />;
};

export default AdminInterceptors;
