import { supabase } from '@/lib/supabaseClient';

export default async function TestPage() {
  const { error } = await supabase.from('orders').select('*').limit(1);
  
  if (error) return <div>Greška u konekciji: {error.message}</div>;
  return <div>Konekcija sa Supabase bazom je uspješna!</div>;
}