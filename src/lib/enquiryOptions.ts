/** Enquiry constants safe to import from client components. */
export const CALL_TIMES = ["Anytime", "Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"] as const;
export const ENQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
