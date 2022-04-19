import { Address } from '../../models/zone.model';

const useAdressName = (address: Address) => {
  const adr = address.name.split(', ');
  const city = adr.length > 2 ? adr[1] : adr[0].split(' ')[1];
  const street = adr.length > 2 ? adr[0] : adr[0];

  return { city, street };
};

export default useAdressName;
