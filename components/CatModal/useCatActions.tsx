import { useContext } from 'react';
import { useSWRConfig } from 'swr';
import { Cat, CatUI } from '../../models/cat.model';
import { addCatToZone, deleteCat, sterilizeCat, updateCat } from '../../ui/ZoneServices';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import { FormValues } from './CatModalView';

const useCatActions = (catId: string) => {
  const { interestZone } = useContext(InterestZoneProviderContext);
  const { mutate } = useSWRConfig();
  const zoneId = interestZone?._id!;

  function getBody(values: FormValues) {
    let body: Partial<CatUI> = {
      gender: values.gender,
      observations: values.observations,
      mediaLinks: values.mediaLinks,
      sterilizedStatus: false,
    };
    if (values.sterilizedStatus === 'sterilized')
      body = {
        ...body,
        volunteerName: values.volunteerName,
        hospitalizationDate: values.hospitalizationDate?.toString(),
        releaseDate: values.releaseDate?.toString(),
        sterilizedStatus: true,
      };

    return body;
  }

  const AddCat = async (values: FormValues) => {
    const body = getBody(values);
    await addCatToZone(zoneId, body);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  };

  const UpdateCat = async (values: FormValues) => {
    const body = getBody(values);

    await updateCat(zoneId, body, catId);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  };
  const SterilizeCat = async (values: FormValues) => {
    const body = getBody(values);
    await sterilizeCat(zoneId, body, catId);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  };
  const DeleteCat = async () => {
    await deleteCat(zoneId, catId);
    mutate(`/api/interest-zones/`);
    mutate(`/api/interest-zones/${zoneId}`);
  };

  return { AddCat, UpdateCat, DeleteCat, SterilizeCat };
};
export default useCatActions;
