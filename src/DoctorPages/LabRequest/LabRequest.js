import React,{useState, useEffect} from 'react'
import './LabRequest.css'
// import docuser from '../../images/doc-1.jpg'
import TextField from '@mui/material/TextField';
import {Box,Dialog,DialogTitle,DialogContent,IconButton} from '@mui/material';
import { FiX } from "react-icons/fi";
import LabTests from '../LabRequest/LabTests'
import doc from '../../images/doc-1.jpg'
import DoctorLayout from '../../Pages/DoctorLayout';
import * as API from "../../Api/DoctorApi";
import { USERS } from '../../features/user'
import { useSelector, useDispatch } from 'react-redux'
function LabRequest() {
    const[openModal, setOpenModal]= useState(false)
    const [data, setData]= useState([])
    const [filtered,setFiltered]= useState([]);
    const [searchInput, setSearchInput] = useState("")
    const [loaded, setLoaded] = useState(false);
    const [patientEmail, setPatientEmail] = useState("");
    const [visible,setVisible] = useState(6);
    const dispatch = useDispatch()
    const patientsData = useSelector((state)=>state.user.patients)

        // show more users function
        const showMore = ()=>{
            setVisible(prevValue=>prevValue + 6);
        }
        

    useEffect(() => {
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

      const handleOpenModal = (email) => {
        setPatientEmail(email)
        setOpenModal(true)
      }

    const searchPatient =(searchValue)=>{
        setSearchInput(searchValue);
        if(searchInput){
            const filteredPatient = data[0].filter((person)=>(
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
         {data && data.length ? data[0].slice(0,visible).map(patient=>(
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
        {data && <button onClick={showMore} className='view-more-btn'>View More</button>} 
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
