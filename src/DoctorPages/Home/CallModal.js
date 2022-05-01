import React,{useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './Home.css'
import { useSelector, useDispatch } from 'react-redux'
import { USERS } from '../../features/user'
import {useNavigate } from "react-router-dom"
import * as API from "../../Api/DoctorApi";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CallModal({handleOpen,open,handleClose}) {
    const [data, setData]= useState()
    const [visible,setVisible] = useState(6);
    const [filtered,setFiltered]= useState([]);
    const [searchInput, setSearchInput] = useState("")
    const [user, setUser] = useState([])
    const [loaded, setLoaded] = useState(false);
    const userData = useSelector((state) => state.user.value)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const patientsData = useSelector((state)=>state.user.patients)

    useEffect(() => {
   

        const getPatints = async () => {
          setLoaded(true);
          const res = await API.getPatients();
          if (res) { 
             console.log(res,'from db...')
            dispatch(USERS(res));
            setUser(res)
            setData(res);
            setLoaded(false);
          }
        };
        getPatints();
        
      }, []);

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
    <div>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-wrapper-chat">
            <div className='fixed-top-chat'>
            <h1 className='chat-head-text call-head'>Make Urgent Call to Patient<span onClick={handleClose}>X</span></h1>
            <input type="text"
             placeholder='search for patient'
            className='search-for-patient-input'
            onChange={(e)=>searchPatient(e.target.value)}
            value={searchInput}
            />
            </div>

             {
                 searchInput.length> 0? filtered.map(patient=>(
                    <div onClick={() => navigate("/video-call", { state: { mediaType: "video", doctor: userData, patientEmail: patient.email } })}  class="patient-details">
                    <p>{patient.firstname} {patient.lastname}  <span>{patient.email}</span></p>
                    <span>{patient.phone}</span>
                </div>
                 )):<>{
                    data && data.length? data.map(patient=>(
                        <div onClick={() => navigate("/video-call", { state: { mediaType: "video", doctor: userData, patientEmail: patient.email } })}  class="patient-details">
                        <p className='name-email'>{patient.firstname} {patient.lastname}  <span>{patient.email}</span></p>
                        <span>{patient.phone}</span>
                    </div>
                   ))
                   :'loading.....'}
                    
                 </>
             
             }   
    
        </Box>
      </Modal>
    </div>
  );
}