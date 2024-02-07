import { useEffect, useState } from "react"

const useGeolocation = () => {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: {lat: Number(""), lng: Number("")}
    })

    const onSuccess = (location) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location?.coordinates?.latitude,
                lng: location?.coordinates?.longitude

            }
        })
    }

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(onSuccess)
    },[])

  return location;
}

export default useGeolocation