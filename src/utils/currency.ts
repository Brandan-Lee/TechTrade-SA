export interface ZarFormatOptions {
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
}

export function formatZar(amount: number, options: ZarFormatOptions = {}): string {
	return new Intl.NumberFormat("en-ZA", {
		style: "currency",
		currency: "ZAR",
		...options,
	}).format(amount);
}

export function formatZarFromCents(
	cents: number,
	options: ZarFormatOptions = {},
): string {
	return formatZar(cents / 100, options);
}
