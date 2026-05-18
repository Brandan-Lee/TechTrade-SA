import { Link } from "react-router-dom";

export default function DashBoard() {
	return (
		<div
			style={{
				padding: "2rem",
				background: "#07050e",
				minHeight: "100vh",
				color: "#fff",
				fontFamily: "monospace",
			}}
		>
			<h1
				style={{
					borderBottom: "1px solid rgba(168, 85, 247, 0.2)",
					paddingBottom: "1rem",
				}}
			>
				🛡️ System Operations Control
			</h1>
			<p style={{ color: "#a1a1aa", fontSize: "0.875rem" }}>
				Secure Admin Route Initialized.
			</p>
			<div style={{ marginTop: "2rem" }}>
				<Link
					to="/"
					style={{
						color: "#c084fc",
						textDecoration: "none",
						fontSize: "0.875rem",
					}}
				>
					&larr; Return to Marketplace Front
				</Link>
			</div>
		</div>
	);
}