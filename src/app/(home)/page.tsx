import { getCurrentUser } from "@/lib/get-user";
import HomeView from "@/modules/home/views/home-view";
import { getServersList } from "@/procedures/home/servers-procedure";

const Home = async () => {
  const user = await getCurrentUser();
  const serversList = await getServersList(user?.id);

  return (
    <div className="h-full w-full">
      <HomeView serversList={serversList} />
    </div>
  );
};

export default Home;
