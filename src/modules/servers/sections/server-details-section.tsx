import { DropdownItem, DropdownTrigger } from "@/components/custom/dropdown";
import { getServerData } from "@/procedures/server/servers-procedure";

type ServerViewType = Awaited<ReturnType<typeof getServerData>>;

const ServerDetailsSection = ({
  serverDetails,
}: {
  serverDetails: ServerViewType;
}) => {
  return (
    <div className="h-full w-[20%] flex flex-col gap-2 bg-[#ebebeb] dark:bg-[#222222] items-center">
      <div className="relative p-4 flex gap-2 hover:bg-muted w-full items-center">
        <div>{serverDetails.server.name}</div>
        <DropdownTrigger className="absolute right-2" position="right">
          <DropdownItem>Invite People</DropdownItem>
          <DropdownItem>Delete Server</DropdownItem>
        </DropdownTrigger>
      </div>
    </div>
  );
};

export default ServerDetailsSection;
