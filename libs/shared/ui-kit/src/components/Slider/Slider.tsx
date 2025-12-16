import { Slider as MuiSlider, SliderProps as MuiSliderProps } from '@mui/material';

export interface SliderProps extends MuiSliderProps {
  // Add any custom props here
}

/**
 * Custom Slider component built on MUI Slider
 */
export function Slider(props: SliderProps) {
  return <MuiSlider {...props} />;
}
