import React,{useState, useEffect,useRef} from 'react'
import './LabRequest.css'
import TextField from '@mui/material/TextField';
import {Box,Dialog,DialogTitle,DialogContent,IconButton} from '@mui/material';
import { FiX } from "react-icons/fi";
import LabTests from '../LabRequest/LabTests'
import doc from '../../images/doc-1.jpg'
import DoctorLayout from '../../Pages/DoctorLayout';
import * as API from "../../Api/DoctorApi";
import { USERS } from '../../features/user'
import * as Const from './constants'
import { useSelector, useDispatch } from 'react-redux'
function LabRequest() {
    const[openModal, setOpenModal]= useState(false)
    const [data, setData]= useState([])
    const [filtered,setFiltered]= useState([]);
    const [searchInput, setSearchInput] = useState("")
    const [loaded, setLoaded] = useState(false);
    const [patientEmail, setPatientEmail] = useState("");
    const [visible,setVisible] = useState(6);
    const patientsData = useSelector((state)=>state.user.patients) || [];
    const messagesEndRef = useRef(null)
    
        const showMore = ()=>{
            setVisible(prevValue=>prevValue + 6);
        }
        
    useEffect(() => {
        
        if (patientsData.length) {
          setLoaded(false);
        }else{
            setLoaded(true);
        }
      }, [patientsData]);

      const handleOpenModal = (email) => {
        setPatientEmail(email)
        setOpenModal(true)
      }

    const searchPatient =(searchValue)=>{
        setSearchInput(searchValue);
        if(searchInput){
            const filteredPatient = patientsData.filter((person)=>(
                Object.values(person).join("").toLowerCase().includes(searchValue.toLowerCase())
            ))
            setFiltered(filteredPatient)  
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, [visible]);

     
    return (
        <>
        <DoctorLayout>
        <div class="patients-platform-container">
        <h2>PATIENTS</h2>
        <TextField 
        onChange={(e)=>searchPatient(e.target.value)}
        className="search-p" id="outlined-basic" 
        label="Search for Patient by name phone or email" 
        variant="outlined" fullWidth/>
        {searchInput.length> 0? <div className="all-patient-container">
         {filtered.map(patient=>(
              <div class="card-container-patient">
              <img src={doc} alt=""/>
              <div className="pat-info-claron-docs">
                  <p className="p-name-c">{patient.firstname} {patient.lastname}</p>
                  <p className="p-title-doc"><span>{patient.phone}</span></p>
                  <p className="p-title-doc"><span>{patient.email}</span></p>
                  
                  <button className="add-lab-test-btn" onClick={()=>handleOpenModal(patient.email)}>Add Lab Test</button>
              </div>
      </div>
         ))}   
        </div>:<div className="all-patient-container">
         {patientsData && patientsData.length ? patientsData.slice(0,visible).map(patient=>(
              <div class="card-container-patient">
              <img src={doc} alt=""/>
              <div className="pat-info-claron-docs">
                  <p className="p-name-c">{patient.firstname} {patient.lastname}</p>
                  <p className="p-title-doc"><span>{patient.phone}</span></p>
                  <p className="p-title-doc"><span>{patient.email}</span></p>
                  
                  <button className="add-lab-test-btn" onClick={()=>handleOpenModal(patient.email)}>Add Lab Test</button>
              </div>
      </div>
         )) : <p>Loading...</p>}   
        {patientsData &&<>
        <button onClick={showMore} className='view-more-btn'>View More</button>
        <div ref={messagesEndRef} />
        </> } 
        </div>}
    </div>
            <Dialog open={openModal} fullWidth>
                <DialogTitle>
                    <Box className='lab-head' display="flex" justifyContent="space-between" alignItems="center">
                    Add Lab Test For Patient
                    <IconButton onClick={()=>setOpenModal(false)}>
                        <FiX/>
                    </IconButton>    
                    </Box>
                </DialogTitle>
                <DialogContent>
                   <LabTests email={patientEmail}/>
                </DialogContent>
            </Dialog>
            </DoctorLayout>
            </>
    )
}

export default LabRequest
