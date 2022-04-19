import React from 'react';
import { Status } from '../../models/zone.model';

interface Props {
  location: {
    lat: number;
    lng: number;
  };
  displayZone: (location: { lat: number; lng: number }) => void;
}

const SvgComponentMarker = ({ location, displayZone }: Props) => {
  return (
    <svg
      width={70}
      height={70}
      viewBox='0 0 129 128'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={() => {
        displayZone(location);
      }}>
      <ellipse cx={64.5} cy={64} rx={64.5} ry={64} />

      <path d='M42.065 36.001c-3.613 2.858-4.961 15.681-5.183 21.736C29.78 76.203 43.405 93 67.242 93c18.249 0 32.332-17.047 24.585-35.263 0-17.571-3.9-21.812-5.85-21.736-2.014 0-8.195 5.877-11.034 8.816-8.175-4.56-17.82-1.9-21.622 0-4.562-6.02-9.404-8.385-11.256-8.816Z' />
    </svg>
  );
};

export default SvgComponentMarker;
