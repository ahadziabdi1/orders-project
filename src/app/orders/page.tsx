import { supabase } from '@/lib/supabaseClient';
import { Container, Typography } from '@mui/material';
import OrdersTable from '@/app/components/OrderTable';

export default async function OrdersPage() {
  // Dohvatanje podataka (Korak 4.2 iz zadatka) [cite: 73, 77]
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Greška pri učitavanju: {error.message}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Orders Management App
      </Typography>
      {/* Prikaz podataka kroz MUI DataGrid (Korak 4.3) [cite: 78, 79] */}
      <OrdersTable rows={orders || []} />
    </Container>
  );
}