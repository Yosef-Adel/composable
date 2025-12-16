import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardContent, Box } from '@mui/material';
import { Chart, useChart, ChartLegends, ChartLoading } from './index';

const meta = {
  title: 'Components/Chart',
  component: Chart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Line Chart
export const LineChart: Story = {
  render: () => {
    const chartOptions = useChart({
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
    });

    return (
      <Card>
        <CardHeader title="Line Chart" />
        <CardContent>
          <Chart
            type="line"
            series={[
              {
                name: 'Sales',
                data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
              },
            ]}
            options={chartOptions}
            height={320}
          />
        </CardContent>
      </Card>
    );
  },
};

// Area Chart
export const AreaChart: Story = {
  render: () => {
    const chartOptions = useChart({
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
    });

    return (
      <Card>
        <CardHeader title="Area Chart" />
        <CardContent>
          <Chart
            type="area"
            series={[
              {
                name: 'Revenue',
                data: [31, 40, 28, 51, 42, 109, 100, 120, 95],
              },
            ]}
            options={chartOptions}
            height={320}
          />
        </CardContent>
      </Card>
    );
  },
};

// Bar Chart
export const BarChart: Story = {
  render: () => {
    const chartOptions = useChart({
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
    });

    return (
      <Card>
        <CardHeader title="Bar Chart" />
        <CardContent>
          <Chart
            type="bar"
            series={[
              {
                name: 'Orders',
                data: [44, 55, 41, 67, 22, 43, 21],
              },
            ]}
            options={chartOptions}
            height={320}
          />
        </CardContent>
      </Card>
    );
  },
};

// Donut Chart
export const DonutChart: Story = {
  render: () => {
    const chartOptions = useChart({
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      legend: {
        show: false,
      },
    });

    const series = [44, 55, 13, 33];
    const labels = ['Product A', 'Product B', 'Product C', 'Product D'];
    const colors = ['#00AB55', '#00B8D9', '#FFAB00', '#FF5630'];

    return (
      <Card>
        <CardHeader title="Donut Chart" />
        <CardContent>
          <Chart
            type="donut"
            series={series}
            options={chartOptions}
            height={320}
          />
          <Box sx={{ mt: 3 }}>
            <ChartLegends
              labels={labels}
              colors={colors}
              values={series.map(val => `${val}%`)}
            />
          </Box>
        </CardContent>
      </Card>
    );
  },
};

// Multiple Series
export const MultipleSeries: Story = {
  render: () => {
    const chartOptions = useChart({
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
      legend: {
        show: true,
      },
    });

    return (
      <Card>
        <CardHeader title="Multiple Series" />
        <CardContent>
          <Chart
            type="line"
            series={[
              {
                name: 'Revenue',
                data: [10, 41, 35, 51, 49, 62],
              },
              {
                name: 'Expenses',
                data: [15, 25, 20, 35, 30, 45],
              },
            ]}
            options={chartOptions}
            height={320}
          />
        </CardContent>
      </Card>
    );
  },
};

// Radial Bar
export const RadialBar: Story = {
  render: () => {
    const chartOptions = useChart({
      labels: ['Progress'],
    });

    return (
      <Card>
        <CardHeader title="Radial Bar" />
        <CardContent>
          <Chart
            type="radialBar"
            series={[76]}
            options={chartOptions}
            height={320}
          />
        </CardContent>
      </Card>
    );
  },
};

// Loading State
export const LoadingState: Story = {
  render: () => {
    return (
      <Card>
        <CardHeader title="Loading Chart" />
        <CardContent>
          <Box sx={{ position: 'relative', height: 320 }}>
            <ChartLoading type="line" />
          </Box>
        </CardContent>
      </Card>
    );
  },
};

// With Custom Colors
export const CustomColors: Story = {
  render: () => {
    const chartOptions = useChart({
      colors: ['#FF5630', '#FFAB00', '#00B8D9'],
      xaxis: {
        categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      },
    });

    return (
      <Card>
        <CardHeader title="Custom Colors" />
        <CardContent>
          <Chart
            type="bar"
            series={[
              {
                name: 'Sales',
                data: [400, 430, 448, 470],
              },
            ]}
            options={chartOptions}
            height={320}
          />
        </CardContent>
      </Card>
    );
  },
};
