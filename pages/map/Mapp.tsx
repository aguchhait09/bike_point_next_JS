import React, { MutableRefObject, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { endpoints } from '@/api/endpoints';
import { AllNetwork } from '@/typescript/interface/allNetwork.interface';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import assets from '@/json/assets';
import { Icon, LatLngBounds, Map } from 'leaflet';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import "react-leaflet-fullscreen/styles.css";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Control from 'react-leaflet-custom-control';

interface PropsType {
  lat: number;
  long: number;
}

const Mapp = () => {

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

  console.log('bikepoints', bikepoints)


  const [switched, setSwitched] = useState("");
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null)


  const map = useRef<Map | null>(null)

  const onMapIniti = useCallback((mapInstance: Map | null) => {
    mapInstance?.addEventListener("dragend", () => {
      setMapBounds(mapInstance?.getBounds());
    });
  }, [])

  console.log(map.current, "vv")


  const withinBoundsData = useMemo(() => {
    if (!mapBounds) {
      return []
    };
    return bikepoints?.filter((item) => {
      if (!item?.location?.latitude || !item?.location?.longitude) {
        return false
      }
      return mapBounds?.intersects(new LatLngBounds([[item?.location?.latitude, item?.location?.longitude]]))
    })
  }, [mapBounds])
console.log("withinBoundsData",withinBoundsData)

// Location Find
const [position, setPosition] = useState(null)
  function UserLocation(){
    const mapp = useMapEvents({
      click() {
        mapp.locate()
      },
      locationfound(e) {
        setPosition(e.latlng as any)
        mapp.flyTo(e.latlng, mapp.getZoom())
      },
    })

    console.log('position', position);
    
    return position === null ? null : (
      <Marker position={position} icon={myIcon2}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }
  const myIcon2 = new Icon({
    iconUrl: assets.pointer,
    iconSize: [32, 32]
  })

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontWeight: 'bold'}}>Company <br /> Total: {withinBoundsData?.length}</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>City</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>Country</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  withinBoundsData?.map((item) => {
                    return (
                      <>
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">{item?.company}
                          </TableCell>
                          <TableCell >{item?.location?.city}</TableCell>
                          <TableCell >{item?.location?.country}</TableCell>
                          <TableCell >{item?.name}</TableCell>
                        </TableRow>
                      </>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={6}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            style={{
              height: "100vh",
              backgroundRepeat: 'no-repeat'
            }}
            ref={onMapIniti}
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
            <UserLocation/>
            <FullscreenControl />
            <Control prepend position='topright'>
              {
                switched === 'satelite' ? (
                  <>
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
                    
                  </>
                )
              }
            </Control>
            
          </MapContainer>
        </Grid>
      </Grid>
    </>
  )
}
export default Mapp

