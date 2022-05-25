import axios from 'axios';
import { useSWRConfig } from 'swr';
import { InterestZone, Status } from '../../../models/zone.model';
import { FormValues } from '../InterestZoneView';

interface Address {
  name: string;
  lat: number;
  lng: number;
}

const URL = '/api/interest-zones/';

const addZone = async (zone: Partial<InterestZone>) => {
  const response = await axios.post(URL, {
    address: {
      name: zone?.address?.name,
      lat: zone?.address?.lat,
      lng: zone?.address?.lng,
    },
    noUnsterilizedCats: zone.unsterilizedCats ?? 0,
    status: zone.status,
    contactPerson: {
      phone: zone.contactPerson?.phone,
      name: zone.contactPerson?.name,
    },
    volunteerName: zone.volunteerName,
    observations: '',
    unsterilizedCats: [],
    sterilizedCats: [],
  });
  return response.data;
};

const updateZone = async (zoneId: string, zone: Partial<InterestZone>) => {
  const response = await axios.put(URL + zoneId, zone);
  return response.data;
};

const deleteZone = async (zoneId: string) => {
  const response = await axios.delete(URL + zoneId);
  return response.data;
};

const useZoneActions = (zoneId: string) => {
  const { mutate } = useSWRConfig();

  function getBody(
    values: FormValues,
    address?: Address,
    volunteerName?: string,
    zone?: InterestZone
  ) {
    let body: Partial<InterestZone> = {
      ...(zone ?? {}),
      ...(zone && {
        address: {
          name: values.addressName,
          lat: zone?.address.lat,
          lng: zone?.address.lng,
        },
      }),
      status: values.status,
      contactPerson: {
        name: values.contact,
        phone: values.phone,
      },
      volunteerName: values.volunteerName || volunteerName,
      noUnsterilizedCats: values.noUnsterilizedCats,
      ...(address && {
        address: {
          name: values.addressName,
          lat: Number(address.lat.toFixed(6)),
          lng: Number(address.lng.toFixed(6)),
        },
      }),
    };

    return body;
  }

  const AddZone = async (values: FormValues, address: Address, volunteerName?: string) => {
    const body = getBody(values, address, volunteerName);
    const data = await addZone(body);

    mutate(URL);
  };

  const UpdateZone = async (values: FormValues, zone: InterestZone | undefined) => {
    const body = getBody(values, undefined, undefined, zone);
    await updateZone(zoneId, body);

    mutate(`${URL}${zoneId}`);
    mutate(URL);
  };

  const DeleteZone = async () => {
    await deleteZone(zoneId);
    mutate(URL);
  };

  return { AddZone, UpdateZone, DeleteZone };
};
export default useZoneActions;
