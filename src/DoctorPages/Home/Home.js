import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import * as API from "../../Api/DoctorApi";
import doc from '../../images/doc-1.jpg'
import {useNavigate } from "react-router-dom"
import './Home.css'
import DoctorLayout from '../../Pages/DoctorLayout';
import { FaPhone, FaVideo, FaRocketchat } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
import { getTokenFn } from "../../firebaseConfig";
import {firebaseApp} from "../../firebaseConfig"
import { USERS } from '../../features/user'

const PERPAGE = 6;
function Home() {
    const [page,setPage] = useState(1)
    const [data, setData]= useState([])
    const [filtered,setFiltered]= useState([]);
    const [searchInput, setSearchInput] = useState("")
    const [user, setUser] = useState(null)
    const [loaded, setLoaded] = useState(false);
    const userData = useSelector((state) => state.user.value)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const patientsData = useSelector((state)=>state.user.patients)



    useEffect(() => {
        getTokenFn().then(async(firebaseToken) => {
            try {
              localStorage.setItem("firebaseToken", firebaseToken);
            //   setToken(firebaseToken);
              await firebaseApp.firestore().collection('device_token').doc(userData.email).set({token: firebaseToken})
              // console.log(res, "rrrrr")
              // await API.updateFCMToken(firebaseToken)
            } catch (error) {
              await firebaseApp.firestore().collection('device_token').doc('error').set({token: error});
              console.log(error)
            }
          })
          .catch((err) => {
            return err;
          });
    

        const getPatints = async () => {
          setLoaded(true);
          const res = await API.getPatients();
          if (res) { 
            dispatch(USERS(res));
            setData(patientsData);
            setLoaded(false);
          }
        };
        getPatints();
        
      }, []);

      console.log(patientsData,'redux')
    const searchPatient =(searchValue)=>{
        setSearchInput(searchValue);
        if(searchInput){
            const filteredPatient = data.filter((person)=>(
                Object.values(person).join("").toLowerCase().includes(searchValue.toLowerCase())
            ))
            setFiltered(filteredPatient)  
        }else{
            setFiltered(data)
        }
    }
    return (
        <>
            <DoctorLayout>
            <div class="patients-platform-container">
                <h2>PATIENTS</h2>
                <TextField 
                onChange={(e)=>searchPatient(e.target.value)}
                className="search-p"
                 id="outlined-basic" label="Search for Patient by name phone or email" 
                 variant="outlined" fullWidth />
                {searchInput.length> 0?
                 <div className="all-patient-container">
                    {filtered.map(patient => (
                        <div class="card-container-patient" key={patient.id}>
                            <img src={doc} alt="" />
                            <div className="pat-info-claron-docs">
                                <p className="p-name-c">{patient.firstname} {patient.lastname}</p>
                                <p><span className="p-title-doc">{patient.phone}</span></p>
                                <p><span className="p-title-doc">{patient.email}</span></p>

                                <div className="perform-actions-container">
                                    <FaRocketchat onClick={()=>navigate("/ChatDoctor",{state:{userData: patient}})}  className="phone-doc" />
                                    <FaPhone className="phone-doc" onClick={() => navigate("/video-call", { state: { mediaType: "video", doctor: userData, patientEmail: patient.email } })} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>:<div className="all-patient-container">
                    {data && data.length ? data.map(patient => (
                        <div className="card-container-patient" key={patient.id}>
                            <img src={doc} alt="" />
                            <div className="pat-info-claron-docs">
                                <p className="p-name-c">{patient.firstname} {patient.lastname}</p>
                                <p><span className="p-title-doc">{patient.phone}</span></p>
                                <p><span className="p-title-doc">{patient.email}</span></p>

                                <div className="perform-actions-container">
                                
                                        <FaRocketchat onClick={()=>navigate("/ChatDoctor",{state:{userData: patient}})}  className="phone-doc" />
                                    
                                    <FaPhone className="phone-doc" onClick={() => navigate("/video-call", { state: { mediaType: "video", doctor: userData, patientEmail: patient.email } })} />
                                </div>
                            </div>
                        </div>
                    )): (<p>Loading</p>)}
                </div>}
            </div>
            </DoctorLayout>
        </>
    )
}
export default Home
