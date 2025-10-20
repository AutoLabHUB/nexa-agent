export const extractDomain = (email: string) => (email.split("@")[1] || "").toLowerCase();
export const nowISO = () => new Date().toISOString();
