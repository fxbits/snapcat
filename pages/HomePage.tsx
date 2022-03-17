import {useEffect, useRef, useState} from 'react';
import {Loader} from '@googlemaps/js-api-loader';


function HomePage() {
    const googlemap = useRef<HTMLDivElement>(null);
    

    useEffect(() => {;
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
        });
        let map;
        if (googlemap.current) {
        loader.load().then(() => {
          console.log("Incarcare then")
          const google = window.google;
          map = new google.maps.Map(googlemap.current as HTMLElement, {
            center: {lat: 46.7554536, lng: 23.5671444},
            zoom: 16,
          });

          const marker = new google.maps.Marker({
            position:{lat: 46.7554536, lng: 23.5671444},
            map:map ,
          })

          const infowindow=new google.maps.InfoWindow({
            content: "S-a gasit pisica 1",
          });      

          marker.addListener('click',()=>{
            console.log("S-a dat click 1");
            infowindow.open({
              anchor:marker,
              shouldFocus:false,
            });
            
          })
          const marker2 = new google.maps.Marker({
            position:{lat: 46.7546919, lng: 23.5604183},
            map,
            title:"a doua pisica",
          })
          const marker3 = new google.maps.Marker({
            position:{lat: 46.7545548, lng: 23.558355},
            map: map,
            title:"primul caine gasit",
          })
        });
      }
      
      }, []);

  return (
    <div>
        <h1 className='title'>Harta Google</h1> 
        <div id="map" ref={googlemap} />
    </div> 

  );
}
export default HomePage;

