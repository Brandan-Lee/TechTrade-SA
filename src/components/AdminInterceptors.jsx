import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

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

		// 🚀 BYPASS LOOP: If this admin has already been verified for this session, skip further checks
		if (hasVerifiedAdmin.current) {
			return;
		}

		// Set verification flag to true on the very first successful validation pass
		hasVerifiedAdmin.current = true;

		// 🔒 MFA Safety Gate (Only executes once during initial admin verification)
		if (user.getLastLoginAt?.() !== null) {
			const needsMFA = !user.isMFAEnabled?.();
			const isNotAtDashboardRoot = location.pathname !== "/admin";

			if (needsMFA && isNotAtDashboardRoot) {
				navigate("/admin", { replace: true });
			}
		}
	}, [isLoading, user, isAdminUser, navigate]); // Removed location.pathname to eliminate path change loops

	if (isLoading || !user || !isAdminUser) {
		return null;
	}

	return <Outlet />;
};

export default AdminInterceptors;
