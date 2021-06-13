import Link from 'next/link';
import { Can } from '../components/can';
import { useAuth } from '../contexts/AuthContext';
import { withSSRAuth } from '../utils/withSSRAuth';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
      <button onClick={signOut}>Sign Out</button>
      <Can permissions={['users.list']}>
        <div>User list</div>
      </Can>
      <Can roles={['administrator']}>
        <Link href="/metrics">Metrics</Link>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
