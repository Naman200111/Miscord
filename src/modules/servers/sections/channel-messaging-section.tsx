"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { socket } from "@/lib/socket";
import { v4 as uuid } from "uuid";
import { ErrorBoundary } from "react-error-boundary";

import { DEFAULT_MESSAGES_LIMIT } from "@/lib/constants";

import ErrorComponent from "@/components/custom/error-box";
import InfiniteScroll from "@/components/custom/infinite-scroll";

import { Input } from "@/components/ui/input";

import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { Hash, Loader2Icon, Plus, SendHorizonal, Smile } from "lucide-react";

import ChannelHeader from "../components/channel/channel-header";
import MessageBox from "../components/channel/messages/message-box";

import { messageData } from "@/types/types";
import { cn } from "@/lib/utils";

const ChannelMessagingSectionSkeleton = () => (
  <div className="h-full w-full flex flex-col items-center justify-center">
    <Loader2Icon className="animate-spin" />
  </div>
);

export const ChannelMessagingSection = ({
  channelId,
  serverId,
}: {
  channelId: string;
  serverId: string;
}) => {
  return (
    <Suspense fallback={<ChannelMessagingSectionSkeleton />}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <ChannelMessagingSectionSuspense
          channelId={channelId}
          serverId={serverId}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelMessagingSectionSuspense = ({
  channelId,
  serverId,
}: {
  channelId: string;
  serverId: string;
}) => {
  const trpc = useTRPC();

  const { data: currentUser } = useSuspenseQuery(
    trpc.user.getCurrentUser.queryOptions()
  );

  const { data } = useSuspenseQuery(
    trpc.channel.getOne.queryOptions({ serverId, channelId })
  );

  const {
    data: messagePages,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.message.getMany.infiniteQueryOptions(
      { serverId, channelId, limit: DEFAULT_MESSAGES_LIMIT },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const channelName = data.name;
  const messagesList = useMemo(
    () => (messagePages.pages || []).flatMap((page) => page.messageList),
    [messagePages]
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<messageData[]>(messagesList);

  const listener = useCallback(
    (msgData: messageData) => {
      console.log(typeof msgData.updatedAt, "type of updated at from server ");
      if (channelId === msgData.channelId) {
        setMessages((prev) => {
          const restPrev = prev.filter(
            (msg) => msg.temp_id !== msgData.temp_id
          );
          return [...restPrev, msgData];
        });
      }
    },
    [channelId]
  );

  const handleErrorInSending = useCallback(
    (msgData: messageData) => {
      if (channelId === msgData.channelId) {
        setMessages((prev) => {
          const restPrev = prev.filter(
            (msg) => msg.temp_id !== msgData.temp_id
          );
          return [...restPrev, msgData];
        });
      }
    },
    [channelId]
  );

  useEffect(() => {
    setMessages(messagesList);
  }, [messagesList]);

  useEffect(() => {
    socket.on(`chat:message`, (msgData: messageData) => listener(msgData));
    socket.on("error:sending", (msgData: messageData) =>
      handleErrorInSending(msgData)
    );

    return () => {
      socket.off(`chat:message`, (msgData: messageData) => listener(msgData));
      socket.off("error:sending", (msgData: messageData) =>
        handleErrorInSending(msgData)
      );
    };
  }, [listener, handleErrorInSending]);

  const sendMessage = (msgData: messageData) => {
    if (msgData.msg?.trim() === "") return;
    socket.emit(`chat:message`, msgData);
    setMessage("");
  };

  return (
    <div className="h-full w-full flex-col items-center flex overflow-y-auto no-scrollbar">
      <ChannelHeader name={channelName} serverId={serverId} />
      <div className="w-full flex-1 rounded-none bg-[#e5e5e5] dark:bg-[#2e2e2e] flex flex-col-reverse gap-2">
        <div className="flex items-center mx-2 sm:px-4 my-6 border rounded-md bg-muted">
          <button className="cursor-pointer bg-muted-foreground rounded-full ml-2 sm:ml-1">
            <Plus size={22} className="text-background" />
          </button>
          <div className="relative my-2 focus:outline-none flex-1 border-0 mx-2 flex items-center">
            <Input
              className="w-[90%]"
              placeholder={`Message #${channelName}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                const temp_id = uuid();
                if (e.key.toLowerCase() === "enter") {
                  sendMessage({
                    msg: message,
                    channelId,
                    serverId,
                    userId: currentUser.user.id,
                    state: "pending",
                    temp_id,
                    imageUrl: currentUser.user.imageUrl,
                    role: currentUser.serverUser.role,
                    name: currentUser.user.name,
                  });
                }
              }}
            />
            <div
              className={cn(
                "absolute right-2 cursor-pointer bg-muted",
                !message ? "text-gray-500 pointer-events-none" : ""
              )}
              onClick={(e) => {
                const temp_id = uuid();
                sendMessage({
                  msg: message,
                  channelId,
                  serverId,
                  userId: currentUser.user.id,
                  state: "pending",
                  temp_id,
                  imageUrl: currentUser.user.imageUrl,
                  role: currentUser.serverUser.role,
                  name: currentUser.user.name,
                });
                e.stopPropagation();
              }}
            >
              <SendHorizonal size={16} />
            </div>
          </div>
          <button className="cursor-pointer rounded-full mr-2 sm:mr-1">
            <Smile />
          </button>
        </div>
        <div>
          {messages.map((msgData, index) => (
            <MessageBox key={index} msgData={msgData} />
          ))}
          {/* Todo: fix not working properly */}
          <InfiniteScroll
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            // manual
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="w-20 h-20 p-2 rounded-full flex justify-center items-center bg-[#ececec] dark:bg-[#222222]">
            <Hash size={50} />
          </div>
          <div className="text-3xl font-bold">Welcome to #{channelName}</div>
          <div className="text-md text-muted-foreground">
            This is the start of #{channelName} channel
          </div>
        </div>
      </div>
    </div>
  );
};
