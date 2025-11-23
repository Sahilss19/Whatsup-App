import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Route, Routes , Navigate} from "react-router";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";


const App = () => {
  return (
    <>
      <SignedIn>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/auth" element={<Navigate to = {"/"} replace />} /> 
        </Routes>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to = {"/auth"} replace />} />
        </Routes>
      </SignedOut>
    </>
  );
};

export default App;
