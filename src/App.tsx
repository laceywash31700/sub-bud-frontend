import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./modules/auth/AuthContext";
import Home from "./Home";
import Terms from "./Terms";
import Privacy from "./Privacy";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import RequireAuth from "./modules/components/RequireAuth";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
