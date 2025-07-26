import {
  pgEnum,
  pgTable,
  primaryKey,
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
  inviteLink: text("invite_link").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const channels = pgTable("channels", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  type: channelTypes("type").default("TEXT"),
  name: text("name").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serverUsers = pgTable(
  "server_users",
  {
    role: serverRoles("role").notNull().default("MEMBER"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serverId: uuid("server_id")
      .notNull()
      .references(() => servers.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.serverId] })]
);

export const serverChannels = pgTable(
  "server_channels",
  {
    channelId: uuid("channel_id")
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
    serverId: uuid("server_id")
      .notNull()
      .references(() => servers.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.channelId, t.serverId] })]
);
