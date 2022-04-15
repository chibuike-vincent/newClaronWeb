import React from "react";
import "./options.css";
import { useNavigate } from "react-router-dom";
import doctorDefault from '../../images/doctor.png'
import claronPatient from '../../images/claron-patient.png'
import Navbar from '../../Component/Navbar/Navbar'

function Options() {
const navigate = useNavigate()
    const setType = (type) => {
        if(type === "doctor"){
            navigate("/DocSignIn")
            localStorage.setItem("type",type)
           
        }else{
            navigate("/SignIn") 
            localStorage.setItem("type",type)
           
        }
    }
        return (
            <>
                <Navbar />
                <div className="options-container">
                    <div class="options-card-container">
                    <div onClick={() => setType("doctor")} class="options-card-box-history">
                    <img src={doctorDefault} alt="" />
                    <h4>Login As Doctor</h4>
                    </div>

                    <div onClick={() => setType("patient")} class="options-card-box-history">
                    <img src={claronPatient} alt="" />
                    <h4>Login As Patient</h4>
                    </div>
                </div>
                    
                </div>
    
                
            </>
        
  );
}

export default Options;
