import styles from '../styles/index.module.css';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

const MainApp = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }
  
  if (error) {
    return <div className={styles.container}>{error.message}</div>;
  }

  if (user) {
    return (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <p>Welcome {user.name}!</p> 
          <Link href="/map">Open map</Link>
          <Link href="/api/auth/logout">Logout</Link>
        </div>
      </div>
    );
  }
  
  return(
    <div className={styles.container}>
      <Link href="/api/auth/login">Login</Link>
    </div>
  )};
 

export default MainApp;
         

