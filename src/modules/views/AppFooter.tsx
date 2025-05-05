import * as React from "react";
import {Link as RouterLink} from "react-router-dom"
import Box from "@mui/material/Box";
import Grid from "@mui/material/GridLegacy";
import Link from '@mui/material/Link';
import Container from "@mui/material/Container";
import Typography from "../components/Typography";
import TextField from "../components/TextField";

function Copyright() {
  return (
    <React.Fragment>
      {"© "}
      <Link color="inherit" href="/">
        Sub Bud
      </Link>{" "}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  mr: 1,
  "&:hover": {
    bgcolor: "warning.dark",
  },
};

const LANGUAGES = [
  {
    code: "en-US",
    name: "English",
  },
  {
    code: "fr-FR",
    name: "Français",
  },
];

export default function AppFooter() {
  return (
    <Typography
      component="footer"
      sx={{ display: "flex", bgcolor: "primary.dark" }}
      color="white"
    >
      <Container sx={{ my: 8, display: "flex" }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              spacing={2}
              sx={{ justifyContent: "flex-end", height: 120 }}
            >
              <Grid item sx={{ display: "flex" }}>
                <Box
                  component="a"
                  href="https://www.linkedin.com/in/laceywashington/"
                  sx={iconStyle}
                >
                  <img src="/linkedIn.png" alt="LinkedIn" height="50" />
                </Box>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" color="white" gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/terms"
                  sx={{ color: "white" }}
                >
                  Terms
                </Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link sx={{ color: "white" }} href="/privacy">
                  Privacy
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={8} md={4}>
            <Typography color="white" variant="h6" marked="left" gutterBottom>
              Language
            </Typography>
            <TextField
              select
              size="medium"
              variant="standard"
              SelectProps={{
                native: true,
              }}
              sx={{ mt: 1, width: 150 }}
            >
              {LANGUAGES.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <Typography color="white" variant="caption">
              {"Icons made by "}
              <Link
                href="https://www.cleanpng.com"
                sx={{ color: "white" }}
                title="clean"
              >
                cleanpng
              </Link>
              {" from "}
              <Link
                href="https://www.cleanpng.com"
                rel="sponsored"
                sx={{ color: "white" }}
                title="clean"
              >
                cleanpng.com
              </Link>
              {" All Rights Reserved."}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
