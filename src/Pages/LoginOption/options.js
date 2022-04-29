import React from "react";
import "./options.css";
import { useNavigate } from "react-router-dom";
import doctorDefault from '../../images/login-doc.svg'
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
                    <h4 className="login-options">Login As Doctor <FaArrowRight/> </h4>
                    </div>
                    
                    <div onClick={() => setType("patient")} class="options-card-box-history">
                    <img src={claronPatient} alt="" />
                    <h4 className="login-options">Login As Patient <FaArrowRight/></h4>
                    </div>
                </div>
                    
             
    
            </>
        
  );
}

export default Options;
