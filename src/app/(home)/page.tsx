import HomeView from "@/modules/home/views/home-view";
import { getServersList } from "@/procedures/home/servers-procedure";
import { auth } from "@clerk/nextjs/server";

const Home = async () => {
  const { userId } = await auth();
  const serversList = await getServersList(userId);

  return (
    <div className="h-full w-full">
      <HomeView serversList={serversList} />
    </div>
  );
};

export default Home;
