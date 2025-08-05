import InviteSection from "../sections/invite-section";

const InviteView = ({ inviteCode }: { inviteCode: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <InviteSection inviteCode={inviteCode} />
    </div>
  );
};

export default InviteView;
