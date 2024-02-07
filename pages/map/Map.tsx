import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { endpoints } from '@/api/endpoints';
import { AllNetwork } from '@/typescript/interface/allNetwork.interface';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import assets from '@/json/assets';
import { Icon } from 'leaflet';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import "react-leaflet-fullscreen/styles.css";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import useGeolocation from '@/hooks/useGeolocation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button } from '@mui/material';
import Control from 'react-leaflet-custom-control';

interface PropsType {
  lat: number;
  long: number;
}

const Map = () => {

  const { isPending: loading, error: err, data: bikepoints } = useQuery({
    queryKey: ['bike'],
    queryFn: async () => {
      const res = await axiosInstance.get<AllNetwork>(
        endpoints.allNetworks
      )
      console.log('data', res?.data?.networks);

      return res?.data?.networks
    }
  })
  const myIcon = new Icon({
    iconUrl: assets.markerPng,
    iconSize: [32, 32]
  })

  const location = useGeolocation()

  const [switched, setSwitched] = useState("")


  return (
    <>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{
          height: "100vh",
          backgroundRepeat: 'no-repeat'
        }}
      >

        {
          switched === 'satelite' ? (
            <>
              <TileLayer
                key="stretview"
                attribution="Tiles &copy; Avik"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </>
          ) : (
            <>
              <TileLayer
                key="mapview"
                attribution='&copy; Avik'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </>
          )
        }
        {
          bikepoints?.map((item, key) => {
            return (
              <>
                <Marker
                  icon={myIcon}
                  key={key} position={[item?.location?.latitude, item?.location?.longitude]}>
                  <Popup>
                    Name: {item?.name} <br /> City: {item?.location?.city} <br /> Country: {item?.location?.country} <br /> Company: {item?.company}
                  </Popup>
                </Marker>
              </>
            )
          })
        }
        {/* {
          location.loaded && (
            <Marker 
                icon={myIcon}
                 position={[
                  42,
                  49
                 ]}>
                  <Popup>
                    My Location
                  </Popup>
                </Marker>
          )
        } */}
        <FullscreenControl />
        <Control prepend position='topright'>
          {
            switched === 'satelite' ? (
              <>
                <Box sx={{ my: 1 }}>
                  <Button sx={{
                    backgroundColor: 'white', color: 'black', '&:hover': {
                      backgroundColor: 'white',
                      boxShadow: 'none',
                    }
                  }} onClick={() => setSwitched('satelite')}>
                    Satelite View
                  </Button>
                </Box>
                <Box>
                  <Button sx={{
                    backgroundColor: 'white', color: 'black', '&:hover': {
                      backgroundColor: 'white',
                      boxShadow: 'none',
                    }
                  }} onClick={() => setSwitched('normal')}>
                    Street View
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ my: 1 }}>
                  <Button sx={{
                    backgroundColor: '#333634', color: 'white', '&:hover': {
                      backgroundColor: '#333634',
                      boxShadow: 'none',
                    }
                  }} onClick={() => setSwitched('satelite')}>
                    Satelite View
                  </Button>
                </Box>
                <Box>
                  <Button sx={{
                    backgroundColor: '#333634', color: 'white', '&:hover': {
                      backgroundColor: '#333634',
                      boxShadow: 'none',
                      color: 'white'
                    }
                  }} onClick={() => setSwitched('normal')}>
                    Street View
                  </Button>
                </Box>
              </>
            )
          }
        </Control>
      </MapContainer>
    </>
  )
}
export default Map

