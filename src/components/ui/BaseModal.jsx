import { X } from "lucide-react";
import React from "react";

const BaseModal = ({ isOpen, onClose, title, icon, children, footerText }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-violet-950/60 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal Container */}
			<div className="relative z-10 p-0 max-w-3xl w-full h-[85vh] sm:h-[682px] bg-white rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col shadow-2xl">
				{/* Header Area - shrink-0 prevents it from squishing */}
				<div className="w-full h-20 px-6 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 border-b border-gray-200 flex justify-between items-center shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-full flex justify-center items-center shadow-lg">
							{icon}
						</div>

						<h2 className="text-white text-xl sm:text-3xl font-extrabold tracking-tight italic uppercase">
							{title}
						</h2>
					</div>

					<div className="flex items-center gap-4">
						<button
							onClick={onClose}
							className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20 transition-colors"
						>
							<X className="w-5 h-5 text-pink-600 hover:text-pink-800 hover:scale-[1.5] transition-all" />
						</button>
					</div>
				</div>

				{/* Content Area*/}
				<div className="flex-1 px-4 sm:px-6 py-4 bg-neutral-100 overflow-y-auto flex flex-col justify-center gap-3 custom-scrollbar">
					<div className="w-full">{children}</div>
				</div>

				{/* Footer Area - shrink-0 ensures it stays at the bottom */}
				<div className="w-full h-14 px-6 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 border-t border-pink-600 flex items-center shrink-0">
					<p className="text-white text-xs font-semibold uppercase tracking-wider">
						{footerText}
					</p>
				</div>
			</div>
		</div>
	);
};

export default BaseModal;
