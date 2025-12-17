import { Box } from '@mui/material';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { FeaturesGrid } from './FeaturesGrid';
import { HowItWorksSection } from './HowItWorksSection';
import { BenefitsSection } from './BenefitsSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import type { LandingPageProps } from '../types';

export function LandingPage({ onGetStarted, isLoggedIn, userName }: LandingPageProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <LandingHeader onGetStarted={onGetStarted} isLoggedIn={isLoggedIn} userName={userName} />
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesGrid />
      <HowItWorksSection />
      <BenefitsSection />
      <CTASection onGetStarted={onGetStarted} />
      <LandingFooter />
    </Box>
  );
}
