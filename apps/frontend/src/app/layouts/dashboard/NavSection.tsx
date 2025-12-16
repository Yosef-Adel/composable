import { List, ListSubheader } from '@mui/material';
import { NavItem } from './NavItem';
import type { NavSectionProps } from '../types';

export function NavSection({ data, sx }: NavSectionProps) {
  return (
    <>
      {data.map((section, index) => (
        <List
          key={section.subheader || index}
          subheader={
            section.subheader ? (
              <ListSubheader
                sx={{
                  bgcolor: 'transparent',
                  color: 'text.disabled',
                  fontSize: 11,
                  fontWeight: 'fontWeightBold',
                  textTransform: 'uppercase',
                  lineHeight: 2.5,
                }}
              >
                {section.subheader}
              </ListSubheader>
            ) : null
          }
          sx={{ px: 2, ...sx }}
        >
          {section.items.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}
        </List>
      ))}
    </>
  );
}
