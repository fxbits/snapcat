import axios from 'axios';
import { useContext } from 'react';
import { useSWRConfig } from 'swr';
import imageCompression from 'browser-image-compression';
import BSON from 'bson';
import { CatUI } from '../../models/cat.model';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import { FormValues } from './CatModalView';

const URL = '/api/interest-zones/';
const MAX_SIZE_MB_PICTURE = 1;

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
      const deserialized = BSON.deserialize(Buffer.from(imageBuffer.buffer));
      imageStrings.push({id: imageBuffer.id, imageString: deserialized.buffer.toString('base64')});
  }
  return imageStrings;
}

const addImages = async (zoneID: string, catID: string, formBody: FormData) => {
  const response = await axios.post(`${URL}${zoneID}/${catID}/images`, formBody);

  return response.data;   
}

const deleteImage = async(zoneID: string, catID: string, imageID: string) => {
  const response = await axios.delete(`${URL}${zoneID}/${catID}/${imageID}`);
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

    mutate(`${URL}${zoneId}`);
    mutate(URL);
    
    if (formBody) {
      await AddImages(formBody, cat._id);
      mutate(`${URL}${zoneId}/${cat._id}/images`);
    }
  };

  const UpdateCat = async (values: FormValues, formBody?: FormData, imageIDS?: string[]) => {
    const body = getBody(values);

    await updateCat(zoneId, body, catId);
    if (imageIDS?.length) {
      await DeleteImages(imageIDS);
    }
    if (formBody) {
      await AddImages(formBody);
    }
    
    mutate(`${URL}${zoneId}`);
    mutate(URL);
  };

  const SterilizeCat = async (values: FormValues, formBody?: FormData) => {
    const body = getBody(values);

    const sterilizedCat = await sterilizeCat(zoneId, body, catId);

    if (formBody) {
      AddImages(formBody, sterilizedCat._id);
    }

    mutate(`${URL}${zoneId}`);
    mutate(URL);
  };

  const DeleteCat = async () => {
    await deleteCat(zoneId, catId);
    mutate(`${URL}${zoneId}`);
    mutate(URL);
  };

  const GetImages = async () => {
    try {
      const images = await getImages(zoneId, catId);
      return images;
    } catch(error: any) {
      return [];
    }
  }

  const AddImages = async (formBody: FormData, catID?: string) => {
    if (catID) {
      await addImages(zoneId, catID, formBody);
    } else {
      await addImages(zoneId, catId, formBody);
    }
    mutate(`${URL}${zoneId}/${catId ?? catID}/images`);
  }

  const DeleteImages = async(imageIDS: string[]) => {
    for (const imageID of imageIDS) {
      await deleteImage(zoneId, catId, imageID);
    }
    mutate(`${URL}${zoneId}/${catId}/images`);
  }

  const CompressImage = async (file: File): Promise<File> =>  {
    const options = {
      maxSizeMB: MAX_SIZE_MB_PICTURE
    }

    return await imageCompression(file, options);
  }

  return { AddCat, UpdateCat, DeleteCat, SterilizeCat, GetImages, AddImages, CompressImage };
};
export default useCatActions;
