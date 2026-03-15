import { Track } from "livekit-client";
import * as React from "react";
import {
  ConnectionStateToast,
  ParticipantTile,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { useTracks } from "@livekit/components-react";
import { ControlBar } from "@livekit/components-react";

export const CustomVideoConference = () => {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);

  return (
    <div className="h-full">
      <div className="flex flex-col gap-1 h-full">
        <div className="flex-1 min-h-0 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-2">
          {tracks.map((trackRef) => (
            <ParticipantTile
              key={trackRef.participant.identity + trackRef.source}
              trackRef={trackRef}
            />
          ))}
        </div>
        <ControlBar
          variation="minimal"
          className="mt-auto"
          controls={{
            chat: false,
            leave: false,
            screenShare: false,
            settings: false,
          }}
        />
      </div>
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
};
