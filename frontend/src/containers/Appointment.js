import moment from 'moment';
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { addAdrress, fetchAddress, fetchAvailability, register, bookAppointment } from '../redux/appointments/action';
import BookAppointment from '../views/appointment/BookAppointment';




export default (props) =>{

    
    const lib = ["places"];
    const dispatch = useDispatch();


    const [mapModal, setMapModal] = useState(false);
    const [areaAlertModal, setAreaAlertpModal] = useState(false);
    const [region, setRegion] = useState("outside")



    const [time, setTime] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [coffee, setCoffee] = useState(true);

    const [ mapAddress, setMapAddress] = useState("Central Jakarta, Gambir, Central Jakarta City, Jakarta, Indonesia")
    const [ dropAddress, setDropAddress] = useState("Central Jakarta, Gambir, Central Jakarta City, Jakarta, Indonesia")



    const [userData, setUserData] = useState(props.location.state && props.location.state.data)
    const [userToken, setUserToken] = useState(props.location.state && props.location.state.data.token)
    

    const [mobile, setMobile] = useState(props.location.state && props.location.state.mobile)
    const [countryCode, setCountryCode] = useState(props.location.state && props.location.state.country_code)


    
    
    useEffect(()=>{
        if(!props.location?.state?.status){
            props.history.push('/tryon/login')
        }
    }, [props.location?.state?.status])


    const [ dropLocation, setDropLocation ] = useState({
        coordinates : {lat : '', lng : ''}
    })

    const [ location, setLocation ] = useState({
        loaded : false,
        coordinates : {lat : -6.175131064275111, lng : 106.82725472129276}
    })
    

    const toggleMap = () => setMapModal(!mapModal);
    const toggleAreaAlertMap = () => setAreaAlertpModal(false);


    const getAddress = (location, map = false, drop = false) =>{   
        dispatch(fetchAddress(location,(address)=>{
            map && setMapAddress(address)
            drop && setDropAddress(address)
        }));
    }

    const onSuccess = location =>{
        setLocation({
            loaded : true,
            coordinates : {
                lat : location.coords.latitude,
                lng: location.coords.longitude
            }
        })
        getAddress({
            lat : location.coords.latitude,
            lng: location.coords.longitude
        },true, true)
    }


    const onError = location =>{
  
    }

    const confirmLocation = location =>{
        setLocation({
            loaded : false,
            coordinates : {
                lat : dropLocation.coordinates.lat,
                lng: dropLocation.coordinates.lng
            }
        })

        getAddress({
            lat : dropLocation.coordinates.lat,
            lng: dropLocation.coordinates.lng
        },true, true)
        toggleMap()
    }



    const updateMarker = coord =>{


        if("geometry" in coord){            
            const { geometry  : { location } , formatted_address } = coord;
            setLocation({
                loaded : true,
                coordinates : {
                    lat : location.lat(),
                    lng: location.lng()
                }
            })
    
            setDropLocation({
                coordinates : {
                    lat : location.lat(),
                    lng: location.lng()
                }
            })
    
            setDropAddress(formatted_address)
            setMapAddress(formatted_address)
        }
    }



    const onMarkerDragEnd = (coord, index) => {
        const { latLng } = coord;

        setDropLocation({
            coordinates : {
                lat : latLng.lat(),
                lng: latLng.lng()
            }
        })

        getAddress({
            lat : latLng.lat(),
            lng: latLng.lng()
        }, false, true)
    };


    useEffect(() => {
        if(!("geolocation")  in navigator){
            setLocation({
                loaded : false,
                coordinates : {
                    lat : -6.175131064275111,
                    lng: 106.82725472129276
                }
            })
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    },[])


    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }


    const checkingAvailability = (e) => {

        if(e.target.value.length  == 5){
            dispatch(fetchAvailability(e.target.value,(data)=>{
                if(!data.hto){
                    if(data.coffee){
                        setRegion('inside')
                    }else{
                        setRegion('outside')
                    }
                }else{
                    setAreaAlertpModal(true)
                    setRegion('notallowed')
                }
            }))
        }
    }


    const saveAppointment = (data) => {


        if(userData && Object.keys(userData).length !== 0){
            let addressParams = {
                user_id : userData.id,
                receiver_name: userData.name,
                label_address: "Home",
                phone_number: mobile,
                zip_code : data.zip_code,
                address : data.address,
                address_details : data.address_details
            }


            dispatch(addAdrress(addressParams,userToken, (addressResponse)=>{
                let appointmentParams ={
                    address_id : addressResponse.data.id,
                    timeslot_id : data.time,
                    appointment_date : moment(data.appointmentDate).format("YYYY-MM-DD"),
                    notes : data.notes ? data.notes : "nothanks",
                    sales_channel: "booking_link"
                }

                dispatch(bookAppointment(appointmentParams, userToken, (appointmentResponse)=>{
                    props.history.push('/tryon/thankyou', appointmentResponse.data)
                })) 
            }))
        }else{

            let registerParams = {
                name: data.first_name +" " + data.last_name,
                email: data.email,
                mobile: mobile,
                gender: data.gender  ? data.gender  : 1,
                country_code : countryCode,
                dob: data.dob  ? moment(data.dob).format("YYYY-MM-DD")  :"",
                channel: "Booking Link"
            }


            dispatch(register(registerParams,(registerResponse)=>{

                let addressParams = {
                    user_id : registerResponse.id,
                    receiver_name: data.first_name +" " + data.last_name,
                    label_address: "Home",
                    phone_number: mobile,
                    zip_code : data.zip_code,
                    address : data.address,
                    address_details : data.address_details,
                }

                dispatch(addAdrress(addressParams, registerResponse.data.token, (addressResponse)=>{
                    
                    let appointmentParams ={
                        address_id : addressResponse.data.id,
                        timeslot_id : data.time,
                        appointment_date :  moment(data.appointmentDate).format("YYYY-MM-DD"),
                        notes : data.notes ? data.notes : "nothanks",
                        sales_channel: "booking_link"
                    }
                    dispatch(bookAppointment(appointmentParams,registerResponse.data.token, (appointmentResponse)=>{
                        props.history.push('/tryon/thankyou', appointmentResponse.data)
                    })) 
                }))
            }))
        }
    }


    return(
        <BookAppointment 
            {...props}
            lib={lib}
            markerposition={location.coordinates}
            onMarkerDragEnd={onMarkerDragEnd.bind(null)}
            updateMarker={updateMarker.bind(null)}
            mapAddress={mapAddress}
            dropAddress={dropAddress}
            toggleMap={toggleMap.bind(null)}
            toggleAreaAlertMap={toggleAreaAlertMap.bind(null)}
            addDays={addDays.bind(null)}
            mapModal={mapModal}
            confirmLocation={confirmLocation.bind(null)}
            areaAlertModal={areaAlertModal}
            checkingAvailability={checkingAvailability.bind(null)}
            saveAppointment={saveAppointment.bind(null)}
            region={region}
            setTime={setTime}
            time={time}
            setAppointmentDate={setAppointmentDate}
            appointmentDate={appointmentDate}
            coffee={coffee}
            setCoffee={setCoffee}
            userData={userData}
        />
    )
}