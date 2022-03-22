import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Welcome from './components/Welcome';

const MainApp = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>{error.message}</div>;
  }

  if (user) {
    return (
      <div>
        Welcome {user.name}! 
        <br></br>
        <Link href="/api/auth/logout">Logout</Link>
        <br></br>
        <Welcome user={user}/>
      </div>
    );
  }

  return(
    <Link href="/api/auth/login">Login</Link>
  )
};

export default MainApp;
