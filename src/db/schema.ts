import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// enums
export const serverRoles = pgEnum("server_roles", [
  "MEMBER",
  "ADMIN",
  "MODERATOR",
]);

export const channelTypes = pgEnum("channel_types", ["TEXT", "AUDIO", "VIDEO"]);

// tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  clerkId: text("clerk_id").notNull(),
  imageUrl: text("image_url"),
  name: text("name").notNull(),
  email: text("email").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const servers = pgTable("servers", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  imageUrl: text("image_url"),
  imageKey: text("image_key"),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const channels = pgTable("channels", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  type: channelTypes("type").default("TEXT"),
  name: text("name").notNull(),
  serverId: uuid("server_id").references(() => servers.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serverUsers = pgTable("server_users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  role: serverRoles("role").notNull().default("MEMBER"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  serverId: uuid("server_id")
    .notNull()
    .references(() => servers.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serverChannels = pgTable("server_channels", {
  id: uuid("server_channels_id").defaultRandom().primaryKey().notNull(),
  channelId: uuid("channel_id")
    .notNull()
    .references(() => channels.id, { onDelete: "cascade" }),
  serverId: uuid("server_id")
    .notNull()
    .references(() => servers.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("message_id").defaultRandom().primaryKey().notNull(),
  msg: text("message").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  channelId: uuid("channel_id")
    .notNull()
    .references(() => channels.id, { onDelete: "cascade" }),
  serverId: uuid("server_id")
    .notNull()
    .references(() => servers.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
