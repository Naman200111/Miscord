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
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { Hash, Loader2Icon, SendHorizonal } from "lucide-react";

import ChannelHeader from "../components/channel/channel-header";
import MessageBox from "../components/channel/messages/message-box";

import { messageData } from "@/types/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  const { data: currentUser } = useSuspenseQuery(
    trpc.user.getCurrentUser.queryOptions(),
  );

  const { data } = useSuspenseQuery(
    trpc.channel.getOne.queryOptions({ serverId, channelId }),
  );

  const {
    data: messagePages,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.message.getMany.infiniteQueryOptions(
      { serverId, channelId, limit: DEFAULT_MESSAGES_LIMIT },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    ),
  );

  const channelName = data.name;
  const serverMessagesList = useMemo(
    () => (messagePages.pages || []).flatMap((page) => page.messageList),
    [messagePages],
  );

  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState<messageData[]>([]);

  // const listener = useCallback(
  //   (msgData: messageData) => {
  //     if (channelId === msgData.channelId) {
  //       setMessages((prev) => {
  //         const exists = prev.some((m) => m.id === msgData.id);
  //         if (exists) {
  //           return prev.map((prevMsg) => {
  //             if (prevMsg.id && msgData.id === prevMsg.id) {
  //               return msgData;
  //             }
  //             return prevMsg;
  //           });
  //         } else {
  //           return [...prev, msgData];
  //         }
  //       });
  //     }
  //   },
  //   [channelId],
  // );

  // useEffect(() => {
  //   setMessages(messagesList);
  // }, [messagesList]);

  // useEffect(() => {
  //   const handler = (msgData: messageData) => handleIncomingMessage(msgData);
  //   socket.on(`chat:message`, handler);
  //   socket.on("error:sending", handler);

  //   return () => {
  //     socket.off(`chat:message`, handler);
  //     socket.off("error:sending", handler);
  //   };
  // }, [handleIncomingMessage]);

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

  // return () => {
  //   socket.off(`chat:message`, (msgData: messageData) => listener(msgData));
  //   socket.off("error:sending", (msgData: messageData) =>
  //     handleErrorInSending(msgData),
  //   );
  // };
  // }, [listener, handleErrorInSending]);

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

  // const deleteMessage = useMutation(
  //   trpc.message.delete.mutationOptions({
  //     onSuccess: (data) => {
  //       queryClient.invalidateQueries(trpc.message.getOne.queryOptions({id: data.id}))
  //       toast.message("Message deleted");
  //     },
  //     onError: () => {
  //       toast.message("Failed to delete message");
  //     },
  //   }),
  // );

  return (
    <div className="h-full w-full flex-col items-center flex overflow-y-auto no-scrollbar">
      <ChannelHeader name={channelName} serverId={serverId} />
      <div className="w-full flex-1 rounded-none bg-[#e5e5e5] dark:bg-[#2e2e2e] flex flex-col-reverse gap-2">
        <div className="mx-2 sm:pr-4 my-6 border rounded-md bg-muted flex items-center gap-4">
          <Input
            placeholder={`Message #${channelName}`}
            className="rounded-l-md rounded-r-none border-none"
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
              "cursor-pointer bg-muted",
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
        <div className="flex-1">
          {messages.map((msgData) => (
            <MessageBox
              key={msgData.id}
              msgData={msgData}
              loggedInUser={currentUser.user.id}
              loggedInUserRole={currentUser.serverUser.role}
              // deleteMessage={deleteMessage}
            />
          ))}
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
