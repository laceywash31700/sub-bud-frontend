import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';

const backgroundImage = "https://images.unsplash.com/photo-1677594332344-6234203fa86d?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function ProductHero() {
  const navigate = useNavigate();
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Your Subscription Buddy 
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
      >
        Keeping track of subscriptions doesn't have to hassle.
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        onClick={() => navigate('/sign-up')}
        size="large"
        component="a"
       
        sx={{ minWidth: 200 }}
      >
        Sign up
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Get email reminder for subscription today. 
      </Typography>
    </ProductHeroLayout>
  );
}