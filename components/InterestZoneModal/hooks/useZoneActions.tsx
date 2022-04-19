import axios from 'axios';
import { useContext } from 'react';
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
    status: Status.TODO,
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

      contactPerson: {
        name: values.contact,
        phone: values.phone,
      },
      volunteerName: values.volunteerName || volunteerName,
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

    addZone(body);
    mutate(`/api/interest-zones/`);
  };

  const UpdateZone = async (values: FormValues, zone: InterestZone | undefined) => {
    const body = getBody(values, undefined, undefined, zone);

    updateZone(zoneId, body);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  };

  const DeleteZone = async () => {
    deleteZone(zoneId);
    mutate(`/api/interest-zones/`);
  };

  return { AddZone, UpdateZone, DeleteZone };
};
export default useZoneActions;
