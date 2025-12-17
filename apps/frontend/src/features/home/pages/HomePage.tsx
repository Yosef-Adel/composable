import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { LandingPage } from '../components/LandingPage';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/projects');
    } else {
      navigate('/auth');
    }
  };

  return <LandingPage onGetStarted={handleGetStarted} />;
}
