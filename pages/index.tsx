import type { NextPage } from 'next'
import { useUser } from '@auth0/nextjs-auth0';
import Welcome from './components/Welcome';



export default () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! 
        <br></br>
        <a href="/api/auth/logout">Logout</a>
        <br></br>
        <Welcome user={user}/>
      </div>
    );
  }

  return(
    <a href="/api/auth/login">Login</a>
  )
};
