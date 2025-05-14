import HomeScreen from "./HomeScreen";
import AuthScreen from "./AuthScreen";

const HomePage = () => {
  const user=false;
  return <div>{user?<HomeScreen/>:<AuthScreen/>}</div>
        {/* if user found go to home else go to auth */}

  
  
};

export default HomePage;