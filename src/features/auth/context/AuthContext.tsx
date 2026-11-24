import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type PropsWithChildren,
} from "react";
import { apiFetch, setSessionExpiredHandler } from "@/lib/api";
import type { AuthUser } from "@/features/auth/types/auth";

interface AuthContextValue {
	user: AuthUser | null;
	isLoading: boolean;
	loginContext: (user: AuthUser) => void;
	logoutContext: () => Promise<void>;
	refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_STORAGE_KEY = "techtrade_user";

const isAuthUser = (value: unknown): value is AuthUser =>
	typeof value === "object" &&
	value !== null &&
	"id" in value &&
	(typeof value.id === "string" || typeof value.id === "number");

const readStoredUser = (): AuthUser | null => {
	try {
		const raw = localStorage.getItem(USER_STORAGE_KEY);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		return isAuthUser(parsed) ? parsed : null;
	} catch {
		return null;
	}
};

const writeStoredUser = (userData: AuthUser | null) => {
	if (userData) {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
	} else {
		localStorage.removeItem(USER_STORAGE_KEY);
	}
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<AuthUser | null>(readStoredUser);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuthStatus = useCallback(async () => {
		try {
			const response = await apiFetch("/models/validation/auth_check.php", {
				method: "GET",
				headers: { Accept: "application/json" },
			});

			const payload: unknown = await response.json();
			const data =
				typeof payload === "object" && payload !== null
					? (payload as { status?: string; user?: unknown })
					: {};

			if (
				response.ok &&
				data.status === "logged_in" &&
				isAuthUser(data.user)
			) {
				setUser(data.user);
				writeStoredUser(data.user);
			} else {
				setUser(null);
				writeStoredUser(null);
			}
		} catch (error) {
			console.error(
				"There was an error retrieving the users logged in status",
				error,
			);
			setUser(null);
			writeStoredUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		checkAuthStatus();
	}, [checkAuthStatus]);

	useEffect(() => {
		setSessionExpiredHandler(() => {
			setUser(null);
			writeStoredUser(null);
			localStorage.removeItem("user_role");
		});
		return () => setSessionExpiredHandler(null);
	}, []);

	const loginContext = (userData: AuthUser) => {
		setUser(userData);
		writeStoredUser(userData);
		if (userData?.roleId != null) {
			localStorage.setItem("user_role", String(userData.roleId));
		}
	};

	const logoutContext = async () => {
		try {
			await apiFetch("/authentication/logout.php", { method: "POST" });
		} catch (error) {
			console.error("Logout request failed:", error);
		} finally {
			setUser(null);
			writeStoredUser(null);
			localStorage.removeItem("user_role");
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				loginContext,
				logoutContext,
				refreshAuth: checkAuthStatus,
			}}
		>
			<div className="text-sm">
				{children}
			</div>
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error("useAuth must be run inside an explicit AuthProvider.");
	return context;
};
