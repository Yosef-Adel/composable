export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface LandingPageProps {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}
