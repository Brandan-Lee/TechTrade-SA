export interface AuthUser {
	id: string | number;
	roleId?: string | number | null;
	fullName?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	province?: string | null;
	reg_type?: string;
	avatar?: string | null;
	avatar_url?: string | null;
	getLastLoginAt?: () => string | null;
	isMFAEnabled?: () => boolean;
}

export interface AuthSuccess {
	user: AuthUser;
}
