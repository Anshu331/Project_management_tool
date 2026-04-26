import "server-only";
import {
  Client,
  Account,
  Databases,
  Databases as DatabaseType,
  Models,
  Storage,
  type Account as AccountType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/constants";

function getEnv(name: string): string | undefined {
  return process.env[name];
}

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabaseType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const endpoint = getEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
    const project = getEnv("NEXT_PUBLIC_APPWRITE_PROJECT");
    if (!endpoint || !project) {
      return c.json({ error: "Appwrite is not configured" }, 500);
    }
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(project);
    const session = getCookie(c, AUTH_COOKIE);
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    client.setSession(session);
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    const user = await account.get();
    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("user", user);
    await next();
  }
);
