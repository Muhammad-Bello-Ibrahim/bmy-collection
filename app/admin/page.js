import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'BMY Atelier — Dedicated Admin Console',
  description: 'Manage products, inventory, adverts, and orders for BMY Collection & Kaftan.',
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
