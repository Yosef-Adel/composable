import { Tabs as MuiTabs, Tab as MuiTab, TabsProps as MuiTabsProps, TabProps as MuiTabProps, Box } from '@mui/material';
import { ReactNode, SyntheticEvent, useState } from 'react';

export interface TabsProps extends Omit<MuiTabsProps, 'children'> {
  /**
   * Tab items
   */
  tabs: Array<{ label: string; value: string; icon?: ReactNode; disabled?: boolean }>;
  /**
   * Tab panels content
   */
  panels?: Array<{ value: string; content: ReactNode }>;
  /**
   * Default value
   */
  defaultValue?: string;
}

interface TabPanelProps {
  children?: ReactNode;
  index: string;
  value: string;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Custom Tabs component built on MUI Tabs
 */
export function Tabs({ tabs, panels, defaultValue, ...props }: TabsProps) {
  const [value, setValue] = useState(defaultValue || tabs[0]?.value || '0');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <MuiTabs value={value} onChange={handleChange} {...props}>
        {tabs.map((tab) => (
          <MuiTab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
            iconPosition="start"
            disabled={tab.disabled}
          />
        ))}
      </MuiTabs>
      {panels && panels.map((panel) => (
        <TabPanel key={panel.value} value={value} index={panel.value}>
          {panel.content}
        </TabPanel>
      ))}
    </Box>
  );
}
