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

import { Hash, Loader2Icon, SendHorizonal } from "lucide-react";

import ChannelHeader from "../components/channel/channel-header";
import MessageBox from "../components/channel/messages/message-box";

import { messageData } from "@/types/types";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/use-socket";

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
  const isSocketConnected = useSocket();

  const { data: currentUser } = useSuspenseQuery(
    trpc.user.getCurrentUser.queryOptions(),
  );

  const { data } = useSuspenseQuery(
    trpc.channel.getOne.queryOptions({ serverId, channelId }),
  );

  const {
    data: messagePages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.message.getMany.infiniteQueryOptions(
      { serverId, channelId, limit: DEFAULT_MESSAGES_LIMIT },
      { getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchInterval: isSocketConnected ? false : 1000
      },
    ),
  );

  const channelName = data.name;
  const serverMessagesList = useMemo(
    () =>
      (messagePages.pages.reverse() || []).flatMap((page) => page.messageList),
    [messagePages],
  );

  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState<messageData[]>([]);

  const handleIncomingMessage = useCallback(
    (incomingMessage: messageData) => {
      if (incomingMessage.channelId !== channelId) return;

      setLiveMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (message) => message.id === incomingMessage.id,
        );

        if (alreadyExists) {
          return previousMessages.map((message) =>
            message.id === incomingMessage.id ? incomingMessage : message,
          );
        }

        return [...previousMessages, incomingMessage];
      });
    },
    [channelId],
  );

  useEffect(() => {
    socket.on("chat:message", handleIncomingMessage);
    socket.on("error:sending", handleIncomingMessage);

    return () => {
      socket.off("chat:message", handleIncomingMessage);
      socket.off("error:sending", handleIncomingMessage);
    };
  }, [handleIncomingMessage]);

  const messages = useMemo(() => {
    const combined = [...serverMessagesList, ...liveMessages];
    const uniqueMap = new Map<string, messageData>();

    combined.forEach((message) => {
      uniqueMap.set(message.id, message);
    });

    return Array.from(uniqueMap.values());
  }, [serverMessagesList, liveMessages]);

  const createAndSendMessage = () => {
    const id = uuid();
    const msgData = {
      id,
      msg: message,
      channelId,
      serverId,
      userId: currentUser.user.id,
      state: "pending",
      imageUrl: currentUser.user.imageUrl,
      role: currentUser.serverUser.role,
      name: currentUser.user.name,
    };

    if (msgData.msg?.trim() === "") return;
    socket.emit(`chat:message`, msgData);
    setMessage("");
  };

  return (
    <div className="h-full w-full flex-col items-center flex bg-[#e5e5e5] dark:bg-[#2e2e2e]">
      <ChannelHeader name={channelName} serverId={serverId} />
      <div className="w-full h-full bg-[#e5e5e5] dark:bg-[#2e2e2e] overflow-y-scroll no-scrollbar flex flex-col-reverse">
        <div>
          <InfiniteScroll
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            manual
          />
          {messages.map((msgData) => (
            <MessageBox
              key={msgData.id}
              msgData={msgData}
              loggedInUser={currentUser.user.id}
              loggedInUserRole={currentUser.serverUser.role}
            />
          ))}
        </div>
        <div className="p-5 mt-auto">
          <div className="w-15 h-15 md:w-20 md:h-20 p-2 mb-2 rounded-full flex justify-center items-center bg-[#ececec] dark:bg-[#222222]">
            <Hash size={40} />
          </div>
          <div className="text-xl md:text-3xl font-bold mb-1">
            Welcome to #{channelName}
          </div>
          <div className="text-sm md:text-md text-muted-foreground">
            This is the start of #{channelName} channel
          </div>
        </div>
      </div>
      <div className="bg-[#e5e5e5] dark:bg-[#2e2e2e] w-full p-2 sm:pr-4 border-t flex items-center gap-4 relative">
        <Input
          placeholder={`Message #${channelName}`}
          className="rounded-md border-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === "enter") {
              createAndSendMessage();
            }
          }}
        />
        <div
          className={cn(
            "cursor-pointer absolute right-7 p-2",
            !message ? "text-gray-500 pointer-events-none" : "",
          )}
          onClick={(e) => {
            createAndSendMessage();
            e.stopPropagation();
          }}
        >
          <SendHorizonal size={16} />
        </div>
      </div>
    </div>
  );
};
