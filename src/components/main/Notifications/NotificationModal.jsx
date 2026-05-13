import { BellRing, CheckCheck } from "lucide-react";
import React, { useState } from "react"; // Added useState for deletion logic
import BaseModal from "../../ui/BaseModal";
import NotificationItem from "./NotificationItem";

const NotificationModal = ({ isOpen, onClose }) => {
    // 1. Initial Mock Data reflecting all required types and statuses
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'offer',
            status: 'pending',
            title: 'New Offer Received',
            time: '2m ago',
            offerAmount: '8,500',
            listingName: 'RTX 3080',
            buyerName: 'Thabo M.',
            read: false
        },
        {
            id: 2,
            type: 'bridge',
            status: 'active',
            title: 'Secure Bridge Active',
            time: '1h ago',
            listingName: 'PlayStation 5',
            sellerName: 'Sarah K.',
            read: false
        },
        {
            id: 3,
            type: 'counter',
            status: 'pending',
            title: 'Counter-Offer Received',
            time: '3h ago',
            offerAmount: '9,000',
            listingName: 'Gaming Chair',
            sellerName: 'Mike D.',
            actionLabel: 'VIEW COUNTER-OFFER',
            read: false
        },
        {
            id: 4,
            type: 'offer',
            status: 'accepted',
            title: 'Offer Accepted!',
            time: '5h ago',
            offerAmount: '12,000',
            listingName: 'AMD Ryzen 9 7950X',
            read: false
        },
        {
            id: 5,
            type: 'offer',
            status: 'declined',
            title: 'Offer Declined',
            time: '1d ago',
            listingName: 'RTX 3060 Ti',
            read: true
        },
        {
            id: 6,
            type: 'bridge',
            status: 'expired',
            title: 'Bridge Expired',
            time: '2d ago',
            listingName: 'Mechanical Keyboard',
            read: true
        }
    ]);

    // 2. Handler to delete a notification
    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // 3. Mark all as read logic
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const notificationActions = (
        <button 
            onClick={markAllAsRead}
            className="text-pink-400 hover:text-pink-200 text-sm font-bold flex items-center gap-1 transition-colors"
        >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Mark all as read</span>
        </button>
    );

    // Derived state for sections
    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="User Notifications"
            icon={<BellRing className="w-5 h-5 text-white" />}
            headerAction={notificationActions}
            footerText={`${unreadNotifications.length} unread notifications`}
            centerContent={false}
        >
            <div className="flex flex-col gap-6">
                {/* UNREAD SECTION */}
                {unreadNotifications.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] px-1">
                            New
                        </h3>
                        {unreadNotifications.map((notif) => (
                            <NotificationItem
                                key={notif.id}
                                {...notif}
                                isRead={false}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* READ SECTION */}
                {readNotifications.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Earlier
                        </h3>
                        {readNotifications.map((notif) => (
                            <NotificationItem
                                key={notif.id}
                                {...notif}
                                isRead={true}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {notifications.length === 0 && (
                    <div className="py-10 text-center text-slate-400 text-sm italic">
                        No notifications to show.
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default NotificationModal;