import React from "react";
import "./options.css";
import { useNavigate } from "react-router-dom";
import doctorDefault from '../../images/doctor-login.png'
import claronPatient from '../../images/examination.png'
import Navbar from '../../Component/Navbar/Navbar'
import { FaArrowRight } from "react-icons/fa";

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
               
                    <div class="options-card-container">
                    <div onClick={() => setType("doctor")} class="options-card-box-history">
                    <img src={doctorDefault} className="doc-login-img" alt="" />
                    <button className="login-options">Login As Doctor <FaArrowRight/> </button>
                    </div>
                    
                    <div onClick={() => setType("patient")} class="options-card-box-history">
                    <img src={claronPatient} alt="" />
                    <button className="login-options">Login As Patient <FaArrowRight/></button>
                    </div>
                </div>
                    
             
    
            </>
        
  );
}

export default Options;
