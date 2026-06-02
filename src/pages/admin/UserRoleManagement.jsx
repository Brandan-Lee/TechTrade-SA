import React, { useState, useEffect } from "react";
import { Search, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import UserRoleCard from "../../components/admin/users/UserRoleCard";
import { apiFetch } from "../../lib/api";
import CyberAlert from "../../components/ui/CyberAlert";

export default function UserRoleManagement() {
	const { user } = useAuth();
	const [users, setUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const [alertConfig, setAlertConfig] = useState({
		show: false,
		type: "error",
		message: "",
	});

	const triggerNotification = (type, message) => {
		setAlertConfig({ show: true, type, message });

		if (type === "success") {
			setTimeout(() => {
				setAlertConfig((prev) => ({ ...prev, show: false }));
			}, 4000);
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await apiFetch("/user/get_all_users.php");
				const result = await response.json();

				if (result.success) {
					setUsers(result.users);
				} else {
					triggerNotification(
						"error",
						result.error || "Failed to load user records.",
					);
				}
			} catch (err) {
				triggerNotification(
					"error",
					"Failed to connect to the database server.",
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	const handleUpdateRole = async (userId, newRoleId) => {
		const targetUser = users.find((u) => u.id === userId);
		const currentRegType = targetUser ? targetUser.regType : "both";

		try {
			const response = await apiFetch("/user/update_user_role.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					user_id: userId,
					new_role_id: newRoleId,
					admin_user_id: user?.id,
					current_reg_type: currentRegType,
				}),
			});
			const result = await response.json();

			if (result.success) {
				let dynamicRegType = currentRegType;
				if (newRoleId === 4) dynamicRegType = "admin";
				if (newRoleId === 3) dynamicRegType = "moderator";

				setUsers((prevUsers) =>
					prevUsers.map((u) =>
						u.id === userId
							? { ...u, roleId: newRoleId, regType: dynamicRegType }
							: u,
					),
				);

				const nameString = targetUser
					? `${targetUser.firstName} ${targetUser.lastName}`
					: "User";
				triggerNotification("success", `${nameString} privileges updated.`);
			} else {
				triggerNotification(
					"error",
					result.error || "Could not update user role.",
				);
			}
		} catch (err) {
			triggerNotification(
				"error",
				"An error occurred while sending the request.",
			);
		}
	};

	const filteredUsers = users.filter((user) => {
		const fullQuery = searchQuery.toLowerCase();
		return (
			`${user.firstName} ${user.lastName}`.toLowerCase().includes(fullQuery) ||
			user.province?.toLowerCase().includes(fullQuery)
		);
	});

	if (isLoading) {
		return (
			<div className="text-center py-12 font-mono text-xs sm:text-sm text-slate-500 uppercase tracking-widest animate-pulse">
				Loading user records...
			</div>
		);
	}

	return (
		<div className="space-y-6 font-mono text-slate-300">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-5">
				<div>
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						User Role{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Management
						</span>
					</h1>
					<p className="text-[10px] sm:text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-wider">
						Manage staff privileges and administrative access levels.
					</p>
				</div>

				<div className="relative w-full sm:w-72">
					<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
						<Search size={16} />
					</span>
					<input
						type="search"
						placeholder="SEARCH BY NAME OR PROVINCE..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-[10px] sm:text-xs tracking-wide uppercase text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500/50 transition-all"
					/>
				</div>
			</header>

			{alertConfig.show && (
				<div className="mb-4">
					<CyberAlert
						type={alertConfig.type}
						message={alertConfig.message}
						onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
					/>
				</div>
			)}

			{/* System Metrics Overview with Scaled Text sizes */}
			<section
				className="grid grid-cols-1 md:grid-cols-3 gap-4"
				aria-label="System Metrics"
			>
				<div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
					<div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-400 shrink-0">
						<Users size={20} />
					</div>
					<div>
						<p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
							Total Operations Staff
						</p>
						<p className="text-base sm:text-lg md:text-xl font-black text-white mt-0.5">
							{users.filter((u) => u.roleId > 1).length}
						</p>
					</div>
				</div>
				<div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
					<div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 shrink-0">
						<ShieldCheck size={20} />
					</div>
					<div>
						<p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
							Active Moderators
						</p>
						<p className="text-base sm:text-lg md:text-xl font-black text-white mt-0.5">
							{users.filter((u) => u.roleId === 3).length}
						</p>
					</div>
				</div>
				<div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
					<div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-500 shrink-0">
						<ShieldAlert size={20} />
					</div>
					<div>
						<p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
							Root Administrators
						</p>
						<p className="text-base sm:text-lg md:text-xl font-black text-white mt-0.5">
							{users.filter((u) => u.roleId === 4).length}
						</p>
					</div>
				</div>
			</section>

			{/* Workspace Cards Layout */}
			<main>
				{filteredUsers.length === 0 ? (
					<div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-black/20">
						{/* Scaled empty state message */}
						<p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-widest">
							No matching user records identified.
						</p>
					</div>
				) : (
					<ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
						{filteredUsers.map((userObj) => (
							<UserRoleCard
								key={userObj.id}
								userObj={userObj}
								onUpdateRole={handleUpdateRole}
							/>
						))}
					</ul>
				)}
			</main>
		</div>
	);
}
