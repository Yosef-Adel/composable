import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

export function HomePage() {
  const modules = [
    { title: 'Items', path: '/items', description: 'Manage items, groups, and price lists' },
    { title: 'Inventory', path: '/inventory', description: 'Track stock and adjustments' },
    { title: 'Sales', path: '/sales', description: 'Manage customers and orders' },
    { title: 'Purchases', path: '/purchases', description: 'Handle vendors and purchases' },
    { title: 'Reports', path: '/reports', description: 'View analytics and reports' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Inventory Management
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Select a module to get started
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.path}>
            <Card
              component={Link}
              to={module.path}
              sx={{
                textDecoration: 'none',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
  );
}
