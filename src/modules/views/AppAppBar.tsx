import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AppBar from "../components/AppBar";
import Toolbar from "../components/Toolbar";
import { useAuth } from "../auth/AuthContext"; // Import your auth context

const rightLink = {
  fontSize: 16,
  color: "common.white",
  ml: 3,
};

function AppAppBar() {
  const { currentUser, logout } = useAuth(); // Get auth state and logout function

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{
              fontSize: 30,
              fontFamily: "Rubik Doodle Shadow",
            }}
          >
            {"Sub Bud"}
          </Link>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {currentUser ? (
              // Show logout button when user is authenticated
              <>
              <Link
              color="inherit"
              variant="h6"
              underline="none"
              component={RouterLink}
              to="/Dashboard.tsx"
              sx={rightLink}>
                 {"Dashboard"}
              </Link>
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                onClick={logout}
                sx={ {...rightLink, color: "secondary.main"} } >
                {"Logout"}
              </Link>
              </>
            ) : (
              // Show sign in/sign up when not authenticated
              <>
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  component={RouterLink}
                  to="/sign-in"
                  sx={rightLink}
                >
                  {"Sign In"}
                </Link>
                <Link
                  variant="h6"
                  underline="none"
                  component={RouterLink}
                  to="/sign-up"
                  sx={{ ...rightLink, color: "secondary.main" }}
                >
                  {"Sign Up"}
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;