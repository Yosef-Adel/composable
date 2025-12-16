import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, TextField, Stack, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchNotFound } from './SearchNotFound';

const meta = {
  title: 'Components/Feedback/SearchNotFound',
  component: SearchNotFound,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchNotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic
export const Basic: Story = {
  args: {
    query: 'react',
  },
};

// No Query
export const NoQuery: Story = {
  args: {
    query: '',
  },
};

// Long Query
export const LongQuery: Story = {
  args: {
    query: 'this is a very long search query that returns no results',
  },
};

// With Custom Styling
export const CustomStyling: Story = {
  args: {
    query: 'javascript',
    sx: {
      p: 3,
      bgcolor: 'background.neutral',
      border: 1,
      borderColor: 'divider',
    },
  },
};

// In Card
export const InCard: Story = {
  render: () => (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <SearchNotFound query="typescript" />
      </CardContent>
    </Card>
  ),
};

// Interactive Search
export const InteractiveSearch: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const mockData = [
      'React',
      'Vue',
      'Angular',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Next.js',
    ];

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setSearchTerm(query);
    };

    const results = mockData.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasSearched = searchTerm !== '';
    const hasResults = results.length > 0;

    return (
      <Box sx={{ width: 500 }}>
        <Card>
          <CardContent>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="Search frameworks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mb: 3 }}
              />
            </form>

            {!hasSearched && (
              <SearchNotFound />
            )}

            {hasSearched && !hasResults && (
              <SearchNotFound query={searchTerm} />
            )}

            {hasSearched && hasResults && (
              <List>
                {results.map((item) => (
                  <ListItem key={item}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  },
};

// Multiple States
export const MultipleStates: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, typography: 'subtitle2' }}>No Query Entered</Box>
          <SearchNotFound />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2, typography: 'subtitle2' }}>Search Result: "python"</Box>
          <SearchNotFound query="python" />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2, typography: 'subtitle2' }}>With Background</Box>
          <SearchNotFound
            query="golang"
            sx={{
              p: 3,
              bgcolor: 'background.neutral',
              borderRadius: 2,
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  ),
};

// In Search Results Page
export const SearchResultsPage: Story = {
  render: () => {
    const [query, setQuery] = useState('nonexistent');

    return (
      <Box sx={{ width: 700, p: 3, bgcolor: 'background.default', minHeight: 400 }}>
        <TextField
          fullWidth
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 4 }}
        />

        <SearchNotFound
          query={query}
          sx={{
            py: 10,
          }}
        />
      </Box>
    );
  },
};

// With Action Buttons
export const WithActions: Story = {
  render: () => {
    return (
      <Card sx={{ width: 500 }}>
        <CardContent>
          <SearchNotFound query="ruby" sx={{ mb: 3 }} />
          <Stack direction="row" spacing={2} justifyContent="center">
            <button
              style={{
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
              }}
              onClick={() => alert('Clear search')}
            >
              Clear Search
            </button>
            <button
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: '#1976d2',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={() => alert('Browse all')}
            >
              Browse All
            </button>
          </Stack>
        </CardContent>
      </Card>
    );
  },
};

// Compact Version
export const Compact: Story = {
  args: {
    query: 'swift',
    sx: {
      p: 2,
      bgcolor: 'warning.lighter',
      border: 1,
      borderColor: 'warning.light',
      '& .MuiTypography-h6': {
        fontSize: '0.875rem',
      },
      '& .MuiTypography-body2': {
        fontSize: '0.75rem',
      },
    },
  },
};
