import useSWR from 'swr';

export default function useInterestZones() {
  const { data: interestZones, error } = useSWR('/api/interest-zones');
  const isLoading = !error && !interestZones;
  return {
    interestZones,
    isLoading,
  };
}
