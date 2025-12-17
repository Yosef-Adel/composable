import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../components/LandingPage';

export function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return <LandingPage onGetStarted={handleGetStarted} />;
}
