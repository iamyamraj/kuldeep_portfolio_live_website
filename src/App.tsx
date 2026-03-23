import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import ChatAgent from "./components/ChatAgent";
import StarryBackground from "./components/StarryBackground";

const App = () => {
  return (
    <>
      <StarryBackground />
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
        <ChatAgent />
      </LoadingProvider>
    </>
  );
};

export default App;
