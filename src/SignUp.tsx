import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from "react-router-dom";
import { Field, Form } from 'react-final-form';
import Typography from './modules/components/Typography';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import { email, required } from './modules/form/validation';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';
import { useAuth } from "./modules/auth/AuthContext";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  [key: string]: string;
}

function SignUp() {
  const [sent, setSent] = React.useState(false);
  const { signUp, loading, error } = useAuth();

  const validate = (values: FormValues) => {
    const errors = required(['firstName', 'lastName', 'email', 'password'], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setSent(true);
      await signUp(
        values.firstName,
        values.lastName,
        values.email,
        values.password
      );
     
    } catch (err) {
      setSent(false);
    }
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign Up
          </Typography>
          <Typography variant="body2" align="center">
            <Link 
              component={RouterLink}
              to="/sign-in" 
              underline="always"
            >
              Already have an account?
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
              <Grid container spacing={2} component="div">
                <Grid size={{ xs: 12, md: 6 }} component="div">
                  <Field
                    autoFocus
                    component={RFTextField}
                    disabled={submitting || loading}
                    autoComplete="given-name"
                    fullWidth
                    label="First name"
                    name="firstName"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} component="div">
                  <Field
                    component={RFTextField}
                    disabled={submitting || loading}
                    autoComplete="family-name"
                    fullWidth
                    label="Last name"
                    name="lastName"
                    required
                  />
                </Grid>
              </Grid>
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || loading}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || loading}
                required
                name="password"
                autoComplete="new-password"
                label="Password"
                type="password"
                margin="normal"
              />
              
              {/* Display auth error if exists */}
              {error && (
                <FormFeedback error sx={{ mt: 2 }}>
                  {error}
                </FormFeedback>
              )}
              
              <FormButton
                sx={{ mt: 3, mb: 2 }}
                disabled={submitting || loading}
                color="secondary"
                fullWidth
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignUp);