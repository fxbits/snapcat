import useSWR from 'swr';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';


const fetcher = async (uri: RequestInfo) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(function Welcome() {
  const { data, error } = useSWR('/api/secure-hello', fetcher);
  
  if (error) 
    return <div>oops... {error.message}</div>;

  if (data === undefined) 
    return <div>Loading...</div>;

  return <div>{data.protected} {data.nickname}</div>;
});