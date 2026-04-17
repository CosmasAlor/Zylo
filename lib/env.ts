const requiredEnvironmentVariables = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
] as const;

requiredEnvironmentVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});

export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  AUTH_SECRET: process.env.AUTH_SECRET as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
};
