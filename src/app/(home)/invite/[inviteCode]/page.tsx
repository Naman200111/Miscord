import InviteView from "@/modules/invite/views/invite-view";

interface InvitePageProps {
  params: Promise<{ inviteCode: string }>;
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const { inviteCode } = await params;
  return <InviteView inviteCode={inviteCode} />;
};

export default InvitePage;
