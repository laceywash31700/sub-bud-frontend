import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
import Grid from '@mui/material/GridLegacy';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';

const item: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function ProductValues() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light' }}
    >
      <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
        <Box
          component="img"
          src="/CurvyLines.png"
          alt="curvy lines"
          sx={{ pointerEvents: 'none', position: 'absolute', top: -180  }}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/track.png"
                alt="road track"
                sx={{ height: 100 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                Track of Subscription 
              </Typography>
              <Typography variant="h5">
                {
                  'Organize every subscription by category '
                }
                {
                  ' and track statuses in one intuitive dashboard.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/email-1.png"
                alt="email"
                sx={{ height: 100 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                Get email reminders 
              </Typography>
              <Typography variant="h5">
                {
                  'Never miss a payment with customizable email alerts sent days'
                }
                {' before renewal, giving you peace of mind and time to budget.'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/cancel-1.png"
                alt="X"
                sx={{ height: 100 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                Cancel and Relax
              </Typography>
              <Typography variant="h5">
                {'Start the cancellation process with a click—we’ll soon automate the tedious follow-ups '}
                {'with providers, so you can reclaim your time while we handle the work.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;