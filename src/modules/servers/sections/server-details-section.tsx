import { getServerData } from "@/procedures/server/servers-procedure";
import ServerHeader from "../components/server-header";

type ServerViewType = Awaited<ReturnType<typeof getServerData>>;

const ServerDetailsSection = ({
  serverDetails,
}: {
  serverDetails: ServerViewType;
}) => {
  return (
    <div className="h-full w-60 flex flex-col gap-2 bg-[#ebebeb] dark:bg-[#222222] items-center">
      <ServerHeader
        name={serverDetails.server.name || "Server name"}
        role={serverDetails.role}
      />
    </div>
  );
};

export default ServerDetailsSection;
