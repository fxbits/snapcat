import { Button, Center, Grid, Group, Text, Title, useMantineTheme } from '@mantine/core';
import React from 'react';
import { BrandAirbnb } from 'tabler-icons-react';

export default function Homepage() {
  const theme = useMantineTheme();
  return (
    <Grid
      columns={14}
      sx={{
        height: '100vh',
        width: '100%',
        backgroundColor: theme.colors.blue[1],
        margin: 0,
      }}>
      <Grid.Col lg={9}>
        <Center sx={{ height: '100%', flexDirection: 'column' }}>
          <BrandAirbnb size={150} />
          <Text sx={{ fontSize: '120px', fontWeight: '600' }}>Snapcat</Text>
        </Center>
      </Grid.Col>
      <Grid.Col lg={5} p={0}>
        <Grid sx={{ height: '100%' }} m={0}>
          <Grid.Col sx={{ backgroundColor: theme.colors.orange[2] }}></Grid.Col>
          <Grid.Col sx={{ backgroundColor: theme.colors.orange[1] }}></Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}
