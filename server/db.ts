import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertPriceItem, InsertUser, priceItems, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listPriceItems() {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  return db.select().from(priceItems).orderBy(asc(priceItems.position), asc(priceItems.id));
}

export async function createPriceItem(input: InsertPriceItem) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(priceItems).values(input);
  const rows = await db.select().from(priceItems).orderBy(asc(priceItems.id));
  return rows[rows.length - 1];
}

export async function updatePriceItem(id: number, input: Partial<InsertPriceItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(priceItems).set(input).where(eq(priceItems.id, id));
  const rows = await db.select().from(priceItems).where(eq(priceItems.id, id)).limit(1);
  return rows[0];
}

export async function deletePriceItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(priceItems).where(eq(priceItems.id, id));
  return { success: true } as const;
}

export async function replacePriceItems(items: InsertPriceItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(priceItems);
  if (items.length) await db.insert(priceItems).values(items);
  return listPriceItems();
}
