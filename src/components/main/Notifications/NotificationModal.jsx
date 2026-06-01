import React, { useState, useEffect } from "react";
import { Terminal, CheckCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import BaseModal from "../../ui/BaseModal";
import NotificationItem from "./NotificationItem";
import { apiFetch } from "../../../lib/api";

const NotificationModal = ({ isOpen, onClose, onCounterAccept }) => {
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!isOpen) return;

		let isMounted = true;
		async function fetchNotifications() {
			try {
				setIsLoading(true);
				setError(null);

				const response = await apiFetch("/notifications/get_notifications.php", {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to download notifications.");
				}

				if (isMounted && data.notifications) {
					setNotifications(data.notifications);
				}
			} catch (err) {
				if (isMounted) {
					setError(err.message || "An error occurred while checking updates.");
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		fetchNotifications();
		return () => {
			isMounted = false;
		};
	}, [isOpen]);

	const handleDelete = async (id) => {
		const confirmed = window.confirm(
			"CRITICAL WARNING:\n\nAre you sure you want to delete this notifcation? This action is permanent and you won't be able to retrieve this notification again.",
		);

		if (!confirmed) return;

		try {
			setNotifications((prev) => prev.filter((n) => n.id !== id));

			await apiFetch("/notifications/delete_notification.php", {
				method: "POST",
				body: JSON.stringify({ id }),
			});
		} catch (err) {
			console.error("Failed to delete notification row:", err);
		}
	};

	const handleAction = async (id, actionType) => {
		const targetNotif = notifications.find((n) => n.id === id);
		if (!targetNotif) return;

		try {
			setNotifications((prev) =>
				prev.map((n) => {
					if (n.id === id) {
						return {
							...n,
							status: actionType === "accept" ? "accepted" : "declined",
						};
					}
					return n;
				}),
			);

			if (targetNotif.type === "counter") {
				const endpoint =
					actionType === "accept"
						? "/offers/accept_counter_offer.php"
						: "/offers/decline_counter_offer.php";

				const response = await apiFetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						offer_id: parseInt(targetNotif.offer_id),
					}),
				});

				const data = await response.json();

				if (!response.ok || data.status === "error") {
					throw new Error(data.message || "Sign-in credentials rejected.");
				}

				setTimeout(() => {
					onClose();

					if (onCounterAccept) {
						onCounterAccept(data.transaction_id);
						console.log(data.transaction_id);
					}
				}, 2000);
			}
		} catch (err) {
			console.error("Failed to execute action request update:", err);
		}
	};

	const markAllAsRead = async () => {
		try {
			setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));

			await apiFetch("/notifications/mark_all_read.php", {
				method: "POST",
			});
		} catch (err) {
			console.error("Failed to mark item rows read:", err);
		}
	};

	const getTimeAgo = (dateString) => {
		if (!dateString) return "Recently";
		const now = new Date();
		const past = new Date(dateString.replace(/-/g, "/"));
		const diffMs = now - past;

		const diffMins = Math.floor(diffMs / 60000);
		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;

		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours}h ago`;

		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays}d ago`;
	};

	const activeNotifications = notifications.filter(
		(n) => Number(n.is_deleted) !== 1,
	);
	const unreadNotifications = activeNotifications.filter(
		(n) => Number(n.is_read) === 0,
	);
	const readNotifications = activeNotifications.filter(
		(n) => Number(n.is_read) === 1,
	);

	const hasUnread = unreadNotifications.length > 0;

	const notificationActions =
		activeNotifications.length > 0 ? (
			<button
				onClick={markAllAsRead}
				disabled={!hasUnread}
				className={`font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 px-2 py-1 rounded border transition-all focus:outline-none ${
					hasUnread
						? "text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.08] hover:border-fuchsia-500/50 cursor-pointer focus:ring-1 focus:ring-fuchsia-400"
						: "text-slate-600 border-white/5 bg-transparent cursor-not-allowed opacity-40"
				}`}
			>
				<CheckCheck size={12} />
				<span>Mark All As Read</span>
			</button>
		) : null;

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Notifications"
			icon={<Terminal size={16} className="text-fuchsia-500" />}
			headerAction={notificationActions}
			footerText={
				isLoading
					? "Syncing..."
					: `${unreadNotifications.length} unread notifications`
			}
			centerContent={false}
			className="bg-[#08080a] border border-purple-500/20 rounded-xl max-w-2xl w-full mx-auto shadow-[0_0_30px_rgba(0,0,0,0.8)]"
		>
			<div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-purple-900/40 scrollbar-track-transparent">
				{isLoading ? (
					<div className="py-20 flex flex-col items-center justify-center gap-3">
						<Loader2 className="w-6 h-6 text-fuchsia-500 animate-spin" />
						<p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
							Fetching feed updates...
						</p>
					</div>
				) : error ? (
					<div className="py-12 border border-red-500/20 bg-red-950/10 rounded-lg text-center p-6">
						<p className="text-red-400 text-xs font-mono uppercase tracking-wider">
							Error: {error}
						</p>
					</div>
				) : (
					<>
						{/* New / Unread Notifications Container Section */}
						{unreadNotifications.length > 0 && (
							<div className="flex flex-col gap-2.5">
								<div className="flex items-center gap-2 text-fuchsia-500 px-1">
									<Eye size={12} className="animate-pulse" />
									<h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em]">
										NEW
									</h3>
								</div>
								<div className="space-y-2">
									{unreadNotifications.map((notif) => (
										<NotificationItem
											key={notif.id}
											{...notif}
											status={notif.status}
											time={getTimeAgo(notif.created_at)}
											onAction={handleAction}
											onDelete={handleDelete}
											isRead={notif.is_read}
										/>
									))}
								</div>
							</div>
						)}

						{/* Older / Read Notifications Container Section */}
						{readNotifications.length > 0 && (
							<div className="flex flex-col gap-2.5">
								<div className="flex items-center gap-2 text-slate-500 px-1">
									<EyeOff size={12} />
									<h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em]">
										EARLIER
									</h3>
								</div>
								<div className="space-y-2">
									{readNotifications.map((notif) => (
										<NotificationItem
											key={notif.id}
											{...notif}
											time={getTimeAgo(notif.created_at)}
											onAction={handleAction}
											onDelete={handleDelete}
										/>
									))}
								</div>
							</div>
						)}

						{/* Blank / Empty State Notification Screen Area */}
						{activeNotifications.length === 0 && (
							<div
								role="status"
								aria-live="polite"
								className="py-12 px-4 border border-dashed border-white/5 bg-black/20 rounded-lg text-center font-mono space-y-2"
							>
								<p className="text-slate-600 text-xs uppercase tracking-widest font-bold">
									No Notifications Found
								</p>
								<p className="text-[10px] text-slate-700 uppercase tracking-wider">
									We will let you know when something turns up.
								</p>
							</div>
						)}
					</>
				)}
			</div>
		</BaseModal>
	);
};

export default NotificationModal;
