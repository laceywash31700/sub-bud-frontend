import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/GridLegacy';
import Container from '@mui/material/Container';
import Button from '../components/Button';
import Typography from '../components/Typography';

const item: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

const number = {
  fontSize: 24,
  fontFamily: 'default',
  color: 'secondary.main',
  fontWeight: 'medium',
};

const image = {
  height: 130,
  my: 4,
};

function ProductHowItWorks() {
  const navigate = useNavigate();
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden' }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/static/themes/onepirate/productCurvyLines.png"
          alt="curvy lines"
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
          How it works
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>1.</Box>
                <Box
                  component="img"
                  src="/sign-up.png"
                  alt="suitcase"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  Make an account and add your subscriptions your personal dashboard.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>2.</Box>
                <Box
                  component="img"
                  src="/gear-2.png"
                  alt="graph"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  Manage your subscriptions keeping track of active, paused and 
                  canceled subscriptions calculating total cost each month.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>3.</Box>
                <Box
                  component="img"
                  src="/octi.png"
                  alt="clock"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  Get email notifications for upcoming payments up to a week before renewal 
                  so if you only wanted to try the free trial you got time plan we're all busy
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          onClick={() => navigate('/sign-up')}
          component="a"
          sx={{ mt: 8 }}
        >
          Get started
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;