import { showNotification } from '@mantine/notifications';
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
  let body = {...zone};
  body.observations = '';
  body.unsterilizedCats = [];
  body.sterilizedCats = [];

  await axios.post(URL, body)
  .then((res) => {
    showNotification({
      title: 'Added successfully',
      message: 'A zone has been added!',
      color: 'green'
    })
    return res.status;
  })
  .catch((err) => {
    showNotification({
      title: 'Server error',
      message: err.response.data.message,
      color: 'red'
    })
    return err.response.status;
  });
  
};

const updateZone = async (zoneId: string, zone: Partial<InterestZone>) => {
  await axios.put(URL + zoneId, zone)
  .then((res) => {
    showNotification({
      title: 'Edited successfully',
      message: 'A zone has been edited!',
      color: 'green'
    })
    return res.status;
  })
  .catch((err) => {
    showNotification({
      title: 'Server error',
      message: err.response.data.message,
      color: 'red'
    })
    return err.response.status;
  });
};

const deleteZone = async (zoneId: string) => {
  await axios.delete(URL + zoneId)
  .then((res) => {
    showNotification({
      title: 'Deleted successfully',
      message: 'A zone has been deleted!',
      color: 'green'
    })
    return res.status;
  })
  .catch((err) => {
    showNotification({
      title: 'Server error',
      message: err.response.data.message,
      color: 'red'
    })
    return err.response.status;
  });
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
    const response = await addZone(body);
    mutate(`/api/interest-zones/`);

    return response;
  };

  const UpdateZone = async (values: FormValues, zone: InterestZone | undefined) => {
    const body = getBody(values, undefined, undefined, zone);
    const response = await updateZone(zoneId, body);

    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);

    return response;
  };

  const DeleteZone = async () => {
    const response = await deleteZone(zoneId);
    mutate(`/api/interest-zones/`);

    return response;
  };

  return { AddZone, UpdateZone, DeleteZone };
};
export default useZoneActions;
