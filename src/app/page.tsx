"use client"; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Box, Container, Typography, Paper, Button, Stack } from '@mui/material';
import Link from 'next/link';

export default function LandingPage() {
  const [connection, setConnection] = useState<{ isConnected: boolean; error: string | null; loading: boolean }>({
    isConnected: false,
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase.from('orders').select('id').limit(1);
      setConnection({
        isConnected: !error,
        error: error ? error.message : null,
        loading: false,
      });
    }
    checkConnection();
  }, []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#f8fafc' 
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 4, 
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#0f172a' }}>
            Order Manager Pro
          </Typography>
          
          <Typography color="textSecondary" sx={{ mb: 6, fontWeight: 400 }}>
            Welcome to the Order Management App.
          </Typography>

          <Stack 
            direction="column" 
            spacing={3} 
            alignItems="center"
          >
            {!connection.loading && connection.isConnected && (
              <Button
                component={Link}
                href="/orders"
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: '#0f172a',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#1e293b',
                  }
                }}
              >
                Go to Orders
              </Button>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}