export interface ListingSummary {
	id: string | number;
	sellerId?: string | number;
	title?: string;
	price?: string | number;
	seller?: string;
	location?: string;
	status?: string;
	condition?: string;
	image?: string | null;
}

export const isListingSummary = (value: unknown): value is ListingSummary =>
	typeof value === "object" &&
	value !== null &&
	"id" in value &&
	(typeof value.id === "string" || typeof value.id === "number");
