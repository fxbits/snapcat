import axios from 'axios';
import { useContext } from 'react';
import { useSWRConfig } from 'swr';
import BSON from 'bson';
import { Cat, CatUI } from '../../models/cat.model';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import { FormValues } from './CatModalView';

const URL = '/api/interest-zones/';

const addCatToZone = async (zoneId: string, cat: Partial<CatUI>) => {
  const response = await axios.post(URL + zoneId, cat);
  return response.data;
};

const deleteCat = async (zoneId: string, catID: string) => {
  const response = await axios.delete(URL + zoneId + '/' + catID);
  return response.data;
};

const updateCat = async (zoneId: string, cat: Partial<CatUI>, catID: string) => {
  const response = await axios.put(URL + zoneId + '/' + catID, cat);
  return response.data;
};

const sterilizeCat = async (zoneId: string, cat: Partial<CatUI>, catID: string) => {
  const response = await axios.patch(URL + zoneId + '/' + catID, cat);
  return response.data;
};

const getImages = async (zoneID: string, catID: string) => {
  const response = await axios.get(`${URL}${zoneID}/${catID}/images`);

  let imageStrings = []
  for (const imageBuffer of response.data.imageBuffers) {
      const deserialized = BSON.deserialize(Buffer.from(imageBuffer));
      imageStrings.push(deserialized.buffer.toString('base64'));
  }
  return imageStrings;
}

const addImages = async (zoneID: string, catID: string, formBody: FormData) => {
  const response = await axios.post(`${URL}${zoneID}/${catID}/images`, formBody);

  return response.data;   
}

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

  const AddCat = async (values: FormValues, formBody?: FormData) => {
    const body = getBody(values);
    const cat = await addCatToZone(zoneId, body);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);

    if (formBody) {
      await AddImages(formBody, cat._id);
    }
  };

  const UpdateCat = async (values: FormValues, formBody?: FormData) => {
    const body = getBody(values);

    await updateCat(zoneId, body, catId);
    if (formBody) {
      AddImages(formBody);
      mutate(`/api/interest-zones/${zoneId}/${catId}/images`);  
    }
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

  const GetImages = async () => {
    const images = await getImages(zoneId, catId);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
    return images;
  }

  const AddImages = async (formBody: FormData, catID?: string) => {
    if (catID) {
      await addImages(zoneId, catID, formBody);
    } else {
      await addImages(zoneId, catId, formBody);
    }
    mutate(`/api/interest-zones/${zoneId}/${catId}/images`);
    mutate(`/api/interest-zones/${zoneId}`);
    mutate(`/api/interest-zones/`);
  }

  return { AddCat, UpdateCat, DeleteCat, SterilizeCat, GetImages, AddImages };
};
export default useCatActions;
