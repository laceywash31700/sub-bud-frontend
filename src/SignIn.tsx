import * as React from "react";
import { Field, Form } from "react-final-form";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "./modules/components/Typography";
import AppFooter from "./modules/views/AppFooter";
import AppAppBar from "./modules/views/AppAppBar";
import AppForm from "./modules/views/AppForm";
import { email, required } from "./modules/form/validation";
import RFTextField from "./modules/form/RFTextField";
import FormButton from "./modules/form/FormButton";
import FormFeedback from "./modules/form/FormFeedback";
import withRoot from "./modules/withRoot";
import { useAuth } from "./modules/auth/AuthContext";

function SignIn() {
  const [sent, setSent] = React.useState(false);
  const { login, loading: authLoading, error: authError } = useAuth();


  const validate = (values: { [index: string]: string }) => {
    const errors = required(["email", "password"], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setSent(true);
      await login(values.email, values.password);
    } catch (error) {
      setSent(false);
    }
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign In
          </Typography>
          <Typography variant="body2" align="center">
            {"Not a member yet? "}
            <Link
              component={RouterLink}
              to="/sign-up"
              align="center"
              underline="always"
            >
              Sign Up here
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box
              component="form"
              onSubmit={handleSubmit2}
              noValidate
              sx={{ mt: 6 }}
            >
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent || authLoading}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent || authLoading}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
              />

             
              {authError && (
                <FormFeedback error sx={{ mt: 2 }}>
                  {authError}
                </FormFeedback>
              )}

              <FormButton
                sx={{ mt: 3, mb: 2 }}
                disabled={submitting || sent || authLoading}
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting || sent || authLoading
                  ? "Signing In..."
                  : "Sign In"}
              </FormButton>
            </Box>
          )}
        </Form>
        <Typography align="center">
          <Link underline="always" href="/forgot-password">
            Forgot password?
          </Link>
        </Typography>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
