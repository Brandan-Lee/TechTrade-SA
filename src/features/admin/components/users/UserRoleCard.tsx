import React from "react";
import {
	ShieldAlert,
	ShieldCheck,
	User,
	ArrowUpRight,
	ArrowDownRight,
	MapPin,
	AlertTriangle,
} from "lucide-react";

export default function UserRoleCard({ userObj, onUpdateRole }) {
	const getRoleDetails = (roleId) => {
		switch (Number(roleId)) {
			case 4:
				return {
					name: "Admin",
					style: "text-secondary border-secondary/30 bg-secondary/5",
					icon: ShieldAlert,
				};
			case 3:
				return {
					name: "Moderator",
					style: "text-secondary border-secondary/30 bg-secondary/5",
					icon: ShieldCheck,
				};
			default:
				return {
					name: "User",
					style: "text-slate-400 border-white/10 bg-white/5",
					icon: User,
				};
		}
	};

	const role = getRoleDetails(userObj.roleId);
	const RoleIcon = role.icon;

	return (
		<li className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-white/10 transition-all">
			<article className="flex flex-col gap-4 w-full justify-between h-full">
				<header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
					<div className="flex items-center gap-3 sm:gap-4">
						<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center font-black text-xs sm:text-sm md:text-base text-white shrink-0">
							{userObj.firstName?.[0] || "U"}
							{userObj.lastName?.[0] || "N"}
						</div>
						<div>
							<h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase text-white tracking-wide">
								{userObj.firstName} {userObj.lastName}
							</h3>
							<div className="flex items-center gap-1 text-slate-500 text-xs sm:text-sm mt-0.5">
								<MapPin size={12} className="text-slate-600 shrink-0" />
								<span className="uppercase tracking-wider">
									{userObj.province || "Unknown Region"}
								</span>
							</div>
						</div>
					</div>

					<span
						className={`self-start sm:self-center px-2.5 py-1 rounded-lg border text-sm font-black uppercase tracking-widest flex items-center gap-1.5 ${role.style}`}
					>
						<RoleIcon size={12} className="shrink-0" />
						{role.name}{" "}
						<span className="opacity-60">(ID: {userObj.roleId})</span>
					</span>
				</header>

				<div className="grid grid-cols-4 gap-1 sm:gap-2 py-3 border-y border-white/5 text-center bg-black/20 rounded-xl">
					<section>
						<h4 className="text-sm uppercase tracking-wider text-slate-500">
							Reg Type
						</h4>
						<p className="text-sm sm:text-base md:text-lg font-black text-slate-300 uppercase mt-0.5">
							{userObj.regType}
						</p>
					</section>
					<section>
						<h4 className="text-sm uppercase tracking-wider text-slate-500">
							Trust Score
						</h4>
						<p
							className={`text-sm sm:text-base md:text-lg font-black mt-0.5 ${userObj.trustScore >= 4 ? "text-emerald-400" : "text-amber-400"}`}
						>
							{Number(userObj.trustScore).toFixed(2)}
						</p>
					</section>
					<section>
						<h4 className="text-sm uppercase tracking-wider text-slate-500">
							Trades
						</h4>
						<p className="text-sm sm:text-base md:text-lg font-black text-slate-300 mt-0.5">
							{userObj.tradeCount}
						</p>
					</section>
					<section>
						<h4 className="text-sm uppercase tracking-wider text-slate-500">
							Strikes
						</h4>
						<p
							className={`text-sm sm:text-base md:text-lg font-black mt-0.5 flex items-center justify-center gap-0.5 ${userObj.strikeCount > 0 ? "text-red-500 animate-pulse" : "text-slate-400"}`}
						>
							{userObj.strikeCount > 0 && (
								<AlertTriangle size={10} className="shrink-0" />
							)}
							{userObj.strikeCount}
						</p>
					</section>
				</div>

				<footer className="flex flex-wrap items-center justify-end gap-2 pt-1">
					{Number(userObj.roleId) === 1 && (
						<>
							<button
								onClick={() => onUpdateRole(userObj.id, 3)}
								className="h-8 sm:h-9 px-2.5 sm:px-3 bg-secondary/5 hover:bg-secondary/10 text-secondary text-xs sm:text-sm md:text-base font-black uppercase tracking-widest rounded-xl border border-secondary/20 transition-all flex items-center gap-1.5 cursor-pointer"
							>
								<ArrowUpRight size={14} className="shrink-0" /> Promote to Mod
							</button>
							<button
								onClick={() => onUpdateRole(userObj.id, 4)}
								className="h-8 sm:h-9 px-2.5 sm:px-3 bg-secondary/5 hover:bg-secondary/10 text-secondary text-xs sm:text-sm md:text-base font-black uppercase tracking-widest rounded-xl border border-secondary/20 transition-all flex items-center gap-1.5 cursor-pointer"
							>
								<ArrowUpRight size={14} className="shrink-0" /> Promote to Admin
							</button>
						</>
					)}

					{Number(userObj.roleId) === 3 && (
						<>
							<button
								onClick={() => onUpdateRole(userObj.id, 1)}
								className="h-8 sm:h-9 px-2.5 sm:px-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs sm:text-sm md:text-base font-black uppercase tracking-widest rounded-xl border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
							>
								<ArrowDownRight size={14} className="shrink-0" /> Demote to User
							</button>
							<button
								onClick={() => onUpdateRole(userObj.id, 4)}
								className="h-8 sm:h-9 px-2.5 sm:px-3 bg-secondary/5 hover:bg-secondary/10 text-secondary text-xs sm:text-sm md:text-base font-black uppercase tracking-widest rounded-xl border border-secondary/20 transition-all flex items-center gap-1.5 cursor-pointer"
							>
								<ArrowUpRight size={14} className="shrink-0" /> Promote to Admin
							</button>
						</>
					)}

					{Number(userObj.roleId) === 4 && (
						<button
							onClick={() => onUpdateRole(userObj.id, 3)}
							className="h-8 sm:h-9 px-2.5 sm:px-3 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 text-xs sm:text-sm md:text-base font-black uppercase tracking-widest rounded-xl border border-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
						>
							<ArrowDownRight size={14} className="shrink-0" /> Demote to Mod
						</button>
					)}
				</footer>
			</article>
		</li>
	);
}
