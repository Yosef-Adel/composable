import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Chip, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FiltersBlock, FiltersResult, chipProps } from './index';

const meta = {
  title: 'Components/Data Display/Filters',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Filters Block
export const BasicBlock: Story = {
  render: () => {
    return (
      <Stack spacing={2}>
        <FiltersBlock label="Category:" isShow>
          <Chip {...chipProps} label="Electronics" onDelete={() => {}} />
          <Chip {...chipProps} label="Clothing" onDelete={() => {}} />
        </FiltersBlock>

        <FiltersBlock label="Price Range:" isShow>
          <Chip {...chipProps} label="$0 - $50" onDelete={() => {}} />
        </FiltersBlock>

        <FiltersBlock label="Brand:" isShow>
          <Chip {...chipProps} label="Apple" onDelete={() => {}} />
          <Chip {...chipProps} label="Samsung" onDelete={() => {}} />
          <Chip {...chipProps} label="Sony" onDelete={() => {}} />
        </FiltersBlock>
      </Stack>
    );
  },
};

// Hidden Filter Block
export const HiddenBlock: Story = {
  render: () => {
    return (
      <Stack spacing={2}>
        <FiltersBlock label="Visible Filter:" isShow>
          <Chip {...chipProps} label="Active" onDelete={() => {}} />
        </FiltersBlock>

        <FiltersBlock label="Hidden Filter:" isShow={false}>
          <Chip {...chipProps} label="This won't show" onDelete={() => {}} />
        </FiltersBlock>
      </Stack>
    );
  },
};

// Basic Results
export const BasicResults: Story = {
  render: () => {
    return (
      <FiltersResult totalResults={42} onReset={() => console.log('Reset filters')}>
        <Chip {...chipProps} label="Category: Electronics" onDelete={() => {}} />
        <Chip {...chipProps} label="Price: $0-$50" onDelete={() => {}} />
        <Chip {...chipProps} label="Brand: Apple" onDelete={() => {}} />
      </FiltersResult>
    );
  },
};

// Complete Filter System
export const CompleteExample: Story = {
  render: () => {
    const [category, setCategory] = useState<string[]>(['electronics']);
    const [priceRange, setPriceRange] = useState<string>('0-50');
    const [brand, setBrand] = useState<string[]>(['apple']);

    const totalResults = 42;

    const handleReset = () => {
      setCategory([]);
      setPriceRange('');
      setBrand([]);
    };

    const handleRemoveCategory = (value: string) => {
      setCategory((prev) => prev.filter((item) => item !== value));
    };

    const handleRemoveBrand = (value: string) => {
      setBrand((prev) => prev.filter((item) => item !== value));
    };

    const hasFilters = category.length > 0 || priceRange || brand.length > 0;

    return (
      <Stack spacing={3}>
        {/* Filter Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              multiple
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value as string[])}
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="books">Books</MenuItem>
              <MenuItem value="home">Home & Garden</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Price Range</InputLabel>
            <Select
              value={priceRange}
              label="Price Range"
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="0-50">$0 - $50</MenuItem>
              <MenuItem value="50-100">$50 - $100</MenuItem>
              <MenuItem value="100-200">$100 - $200</MenuItem>
              <MenuItem value="200+">$200+</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              multiple
              value={brand}
              label="Brand"
              onChange={(e) => setBrand(e.target.value as string[])}
            >
              <MenuItem value="apple">Apple</MenuItem>
              <MenuItem value="samsung">Samsung</MenuItem>
              <MenuItem value="sony">Sony</MenuItem>
              <MenuItem value="lg">LG</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Active Filters Display */}
        <Stack spacing={2}>
          <FiltersBlock label="Category:" isShow={category.length > 0}>
            {category.map((item) => (
              <Chip
                key={item}
                {...chipProps}
                label={item}
                onDelete={() => handleRemoveCategory(item)}
              />
            ))}
          </FiltersBlock>

          <FiltersBlock label="Price:" isShow={!!priceRange}>
            {priceRange && (
              <Chip
                {...chipProps}
                label={`$${priceRange}`}
                onDelete={() => setPriceRange('')}
              />
            )}
          </FiltersBlock>

          <FiltersBlock label="Brand:" isShow={brand.length > 0}>
            {brand.map((item) => (
              <Chip
                key={item}
                {...chipProps}
                label={item}
                onDelete={() => handleRemoveBrand(item)}
              />
            ))}
          </FiltersBlock>
        </Stack>

        {/* Results Summary */}
        {hasFilters && (
          <FiltersResult totalResults={totalResults} onReset={handleReset}>
            {category.map((item) => (
              <Chip
                key={`cat-${item}`}
                {...chipProps}
                label={`Category: ${item}`}
                onDelete={() => handleRemoveCategory(item)}
              />
            ))}
            {priceRange && (
              <Chip
                {...chipProps}
                label={`Price: $${priceRange}`}
                onDelete={() => setPriceRange('')}
              />
            )}
            {brand.map((item) => (
              <Chip
                key={`brand-${item}`}
                {...chipProps}
                label={`Brand: ${item}`}
                onDelete={() => handleRemoveBrand(item)}
              />
            ))}
          </FiltersResult>
        )}
      </Stack>
    );
  },
};

// Many Filters
export const ManyFilters: Story = {
  render: () => {
    return (
      <FiltersResult totalResults={156} onReset={() => {}}>
        <Chip {...chipProps} label="Category: Electronics" onDelete={() => {}} />
        <Chip {...chipProps} label="Category: Computers" onDelete={() => {}} />
        <Chip {...chipProps} label="Price: $100-$200" onDelete={() => {}} />
        <Chip {...chipProps} label="Brand: Apple" onDelete={() => {}} />
        <Chip {...chipProps} label="Brand: Samsung" onDelete={() => {}} />
        <Chip {...chipProps} label="Rating: 4+ stars" onDelete={() => {}} />
        <Chip {...chipProps} label="Shipping: Free" onDelete={() => {}} />
        <Chip {...chipProps} label="Condition: New" onDelete={() => {}} />
      </FiltersResult>
    );
  },
};

// No Results
export const NoResults: Story = {
  render: () => {
    return (
      <FiltersResult totalResults={0} onReset={() => {}}>
        <Chip {...chipProps} label="Category: Rare Items" onDelete={() => {}} />
        <Chip {...chipProps} label="Price: $10000+" onDelete={() => {}} />
      </FiltersResult>
    );
  },
};

// Single Filter
export const SingleFilter: Story = {
  render: () => {
    return (
      <FiltersResult totalResults={8} onReset={() => {}}>
        <Chip {...chipProps} label="Category: Books" onDelete={() => {}} />
      </FiltersResult>
    );
  },
};
