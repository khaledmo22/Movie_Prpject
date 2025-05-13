import { useAuthStore } from "../../store/authUser";
import HomeScreen from "./HomeScreen";
import AuthScreen from "./AuthScreen";

const HomePage = () => {
  const { user } = useAuthStore();
  return <>{user?<HomeScreen/>:<AuthScreen/>}</>
        {/* if user found go to home else go to auth */}

  
  
};

export default HomePage;