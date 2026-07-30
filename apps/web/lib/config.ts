export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3003"

export const links = {
  login: APP_URL,
  signup: `${APP_URL}/onboarding`,
}
