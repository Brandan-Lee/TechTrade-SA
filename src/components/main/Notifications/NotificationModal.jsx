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

		let isActive = true;
		async function loadNotifications() {
			try {
				setIsLoading(true);
				setError(null);

				const response = await apiFetch(
					"/notificications/get_notifications.php",
					{
						method: "GET",
					},
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Could not load updates.");
				}

				if (isActive && data.notifications) {
					setNotifications(data.notifications);
				}
			} catch (err) {
				if (isActive) {
					setError(err.message || "Something went wrong.");
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		loadNotifications();
		return () => {
			isActive = false;
		};
	}, [isOpen]);

	const handleDelete = async (id) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this notification?",
		);
		if (!confirmed) return;

		try {
			setNotifications((prev) => prev.filter((n) => n.id !== id));
			await apiFetch("/notifications/delete_notification.php", {
				method: "POST",
				body: JSON.stringify({ id }),
			});
		} catch (err) {
			console.error("Could not delete:", err);
		}
	};

	const handleAction = async (id, actionType) => {
		const item = notifications.find((n) => n.id === id);
		if (!item) return;

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

			if (item.type === "counter") {
				const path =
					actionType === "accept"
						? "/offers/accept_counter_offer.php"
						: "/offers/decline_counter_offer.php";
				const response = await apiFetch(path, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ offer_id: parseInt(item.offer_id) }),
				});

				const data = await response.json();
				if (!response.ok) throw new Error(data.message || "Action failed.");

				setTimeout(() => {
					onClose();
					if (onCounterAccept) onCounterAccept(data.transaction_id);
				}, 2000);
			}
		} catch (err) {
			console.error("Action failed:", err);
		}
	};

	const markAllAsRead = async () => {
		try {
			setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
			await apiFetch("/notifications/mark_all_read.php", { method: "POST" });
		} catch (err) {
			console.error("Could not update status:", err);
		}
	};

	const formatTime = (dateString) => {
		if (!dateString) return "Recently";
		const past = new Date(dateString.replace(/-/g, "/"));
		const diff = Math.floor((new Date() - past) / 60000);
		if (diff < 1) return "Just now";
		if (diff < 60) return `${diff}m ago`;
		return `${Math.floor(diff / 60)}h ago`;
	};

	const active = notifications.filter((n) => Number(n.is_deleted) !== 1);
	const unread = active.filter((n) => Number(n.is_read) === 0);
	const read = active.filter((n) => Number(n.is_read) === 1);

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Notifications"
			icon={<Terminal size={16} className="text-fuchsia-500" />}
			headerAction={
				active.length > 0 && (
					<button
						onClick={markAllAsRead}
						disabled={unread.length === 0}
						className="text-[10px] sm:text-xs font-black uppercase flex items-center gap-1.5 px-2 py-1 rounded border border-fuchsia-500/20 text-fuchsia-400"
					>
						<CheckCheck size={12} /> Mark All Read
					</button>
				)
			}
			footerText={isLoading ? "Syncing..." : `${unread.length} new items`}
			className="bg-[#08080a] border border-purple-500/20 rounded-xl max-w-2xl w-full mx-auto"
		>
			<div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 text-xs sm:text-sm md:text-base lg:text-lg">
				{isLoading ? (
					<div className="py-20 flex flex-col items-center gap-3">
						<Loader2 className="w-6 h-6 text-fuchsia-500 animate-spin" />
						<p className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold">
							Loading updates...
						</p>
					</div>
				) : error ? (
					<p className="text-red-400 text-center p-6 text-[11px] sm:text-xs md:text-sm">
						{error}
					</p>
				) : (
					<div className="space-y-6">
						{unread.length > 0 && (
							<section className="flex flex-col gap-2">
								<div className="flex items-center gap-2 text-fuchsia-500 px-1">
									<Eye size={12} />
									<h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
										New
									</h3>
								</div>
								{unread.map((n) => (
									<NotificationItem
										key={n.id}
										{...n}
										time={formatTime(n.created_at)}
										onAction={handleAction}
										onDelete={handleDelete}
									/>
								))}
							</section>
						)}
						{read.length > 0 && (
							<section className="flex flex-col gap-2">
								<div className="flex items-center gap-2 text-slate-500 px-1">
									<EyeOff size={12} />
									<h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
										Earlier
									</h3>
								</div>
								{read.map((n) => (
									<NotificationItem
										key={n.id}
										{...n}
										time={formatTime(n.created_at)}
										onAction={handleAction}
										onDelete={handleDelete}
									/>
								))}
							</section>
						)}
						{active.length === 0 && (
							<p className="text-slate-600 text-center p-12 text-[11px] sm:text-xs md:text-sm">
								No notifications found.
							</p>
						)}
					</div>
				)}
			</div>
		</BaseModal>
	);
};

export default NotificationModal;
