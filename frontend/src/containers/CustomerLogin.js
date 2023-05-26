import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { otpSend, otpVerify, login } from '../redux/customer-login/action';
import CustomerLogin from '../views/customer-login/Login';


export default (props) =>{

    const dispatch = useDispatch();

    const [mobile, setMobileNo] = useState('');
    const [country_code, setCountryCode] = useState('');
    const [phone, setPhone] = useState('');
    const [appointmentStep, setAppointmentStep] = useState("phone");
    const [existingUser, setExistingUser] = useState(true);
    const [otpType, setOtpType] = useState('');



    const options = {
        appointmentStep
    };


    const toggleStep = (step) => {
        setAppointmentStep(step)
    }


    const addCustomer = () => {
        setAppointmentStep('method')
    };



    const sendOtp = (type) => {   
        let params = {country_code: "+"+country_code , number:mobile.slice(country_code.length), type}
        setOtpType(type)
        dispatch(otpSend(params,(response)=>{  
            setExistingUser(response.data.isUserExist)
            setAppointmentStep('otp')
        }));

    }


    const reSendOtp = (type) => {
        let params = {country_code: "+"+country_code , number:mobile.slice(country_code.length), type}
        dispatch(otpSend(params,(data)=>{
            console.log(data);
        }));
    };



    const verifyOtp = (data,callback) => {
        let otp = data;
        
        
        if(existingUser){
            let params =  { otp, country_code: "+"+country_code,  mobile:mobile.slice(country_code.length)}
            dispatch(login(params,(data)=>{
                if(data.status == true){
                    props.history.push('/tryon/appointment', {...data, ...params } );
                }else{
                    callback();
                }
            }));
        }else{
            let params =  { otp }
            dispatch(otpVerify(params,(data)=>{ 
                if(data.status == true){
                    props.history.push('/tryon/appointment', { status :true, data : {} , otp, country_code: "+"+country_code,  mobile:mobile.slice(country_code.length)});
                }else{
                    callback();
                }
            }));
        }
    };






    return(
        <CustomerLogin 
            {...props}
            options={options} 
            addCustomer={addCustomer.bind(null)} 
            mobile={mobile}
            phone={phone}
            setPhone={setPhone.bind(null)}
            setMobileNo={setMobileNo.bind(null)}
            setCountryCode={setCountryCode.bind(null)}
            country_code={country_code}
            toggleStep={toggleStep.bind(null)}
            sendOtp={sendOtp.bind(null)}
            verifyOtp={verifyOtp.bind(null)}
            reSendOtp={reSendOtp.bind(null)}
            otpType={otpType}
        />
    )
}