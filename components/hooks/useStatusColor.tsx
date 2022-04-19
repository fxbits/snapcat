import { Status } from '../../models/zone.model';

export const useStatusColor: Record<Status, string> = {
  [Status.DONE]: '#B0EF8F',
  [Status.INPROGRESS]: '#FFDB3C',
  [Status.TODO]: '#EF8F8F',
};

export const useStatusColorMantine: Record<Status, string> = {
  [Status.DONE]: 'green',
  [Status.INPROGRESS]: 'yellow',
  [Status.TODO]: 'red',
};
