import { useContext } from 'react';
import { useSWRConfig } from 'swr';
import { addCatToZone, deleteCat, sterilizeCat, updateCat } from '../../ui/ZoneServices';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import { FormValues } from './CatModalView';

const useCatActions = (catId: string) => {
  const { interestZone } = useContext(InterestZoneProviderContext);
  const { mutate } = useSWRConfig();
  const zoneId = interestZone?._id;
  if (!zoneId) return [];

  const AddCat = async (form: { values: FormValues }) => {
    const body = {
      gender: form.values.gender,
      observations: form.values.observations,
      mediaLinks: form.values.mediaLinks,
      ...(form.values.sterilizedStatus === 'sterilized'
        ? {
            volunteerName: form.values.volunteerName,
            hospitalizationDate: form.values.hospitalizationDate?.toString(),
            releaseDate: form.values.releaseDate?.toString(),
            sterilizedStatus: true,
          }
        : {
            sterilizedStatus: false,
          }),
    };
    await addCatToZone(zoneId, body);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  };

  const DeleteCat = async () => {
    await deleteCat(zoneId, catId);
    mutate(`/api/interest-zones/`);
    mutate(`/api/interest-zones/${zoneId}`);
  };

  const UpdateCat = async (form: { values: FormValues }) => {
    const body = {
      gender: form.values.gender,
      observations: form.values.observations,
      mediaLinks: form.values.mediaLinks,
      ...(form.values.sterilizedStatus === 'sterilized'
        ? {
            volunteerName: form.values.volunteerName,
            hospitalizationDate: form.values.hospitalizationDate?.toString(),
            releaseDate: form.values.releaseDate?.toString(),
            sterilizedStatus: true,
          }
        : {
            sterilizedStatus: false,
          }),
    };
    await updateCat(zoneId, body, catId);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  };
  const SterilizeCat = async (form: { values: FormValues }) => {
    const body = {
      gender: form.values.gender,
      observations: form.values.observations,
      mediaLinks: form.values.mediaLinks,
      ...(form.values.sterilizedStatus === 'sterilized'
        ? {
            volunteerName: form.values.volunteerName,
            hospitalizationDate: form.values.hospitalizationDate?.toString(),
            releaseDate: form.values.releaseDate?.toString(),
            sterilizedStatus: true,
          }
        : {
            sterilizedStatus: false,
          }),
    };
    await sterilizeCat(zoneId, body, catId);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  };

  return [AddCat, UpdateCat, DeleteCat, SterilizeCat] as const;
};
export default useCatActions;
