export type channelRoles = "MEMBER" | "MODERATOR" | "ADMIN";
export type channelType = "TEXT" | "AUDIO" | "VIDEO";
export type customizeChannelOptions = "Edit" | "Create";

export interface customizeChannelForm {
  name: string;
  type: channelType;
  modalType: customizeChannelOptions;
  channelId?: string;
}

export interface channel {
  id: string;
  type: channelType | null;
  name: string;
  serverId: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface messageData {
  id?: string;
  msg: string;
  channelId: string;
  serverId: string;
  userId: string;
  state?: "pending" | "success" | "error";
  createdAt?: Date;
  updatedAt?: Date;
  temp_id?: string;
}

export interface User {
  id: string;
  clerkId: string;
  imageUrl: string | null;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
