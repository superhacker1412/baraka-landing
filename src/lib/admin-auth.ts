const SESSION_KEY = "barakali-admin-session";
const SESSION_TOKEN = "barakali-admin-authenticated";

const ADMIN_EMAIL = "amir@gmail.com";
const ADMIN_PASSWORD = "Koma1Qwerty1";

export function validateAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function loginAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, SESSION_TOKEN);
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_KEY) === SESSION_TOKEN;
}

export const adminCredentials = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};
