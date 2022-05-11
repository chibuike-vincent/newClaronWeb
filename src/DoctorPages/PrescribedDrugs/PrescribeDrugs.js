import React, { useState, useEffect,useRef } from "react";
import "./PrescribeDrugs.css";
import TextField from "@mui/material/TextField";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { Patients } from "../LabRequest/Patient";
import doc from "../../images/doc-1.jpg";
import { Link } from "react-router-dom";
import DoctorLayout from "../../Pages/DoctorLayout";
import * as API from "../../Api/DoctorApi";
import DocDrugs from "./DocDrugs";
import { USERS } from '../../features/user'
import { useSelector, useDispatch } from 'react-redux'

function PrescribeDrugs() {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [visible,setVisible] = useState(6);
  const dispatch = useDispatch()
  const patientsData = useSelector((state)=>state.user.patients)
  const messagesEndRef = useRef(null)

  const showMore = ()=>{
    setVisible(prevValue=>prevValue + 6);
}

  useEffect(() => {
    const getPatints = async () => {
      setLoaded(true);
      const res = await API.getPatients();
      const drugs = await API.getDrugs();
      setDrugs(drugs);
      if (patientsData.length) {
  
        setLoaded(false);
      
      }
    };
    getPatints();
  }, [patientsData]);

  const searchPatient = (searchValue) => {
    setSearchInput(searchValue);
    if (searchInput) {
      const filteredPatient = patientsData.filter((person) =>
        Object.values(person)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setFiltered(filteredPatient);
    } 
   
  };

  const handleOpenModal = (email) => {
    setPatientEmail(email);
    setOpenModal(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [visible]);

  return (
    <DoctorLayout>
      <div class="patients-platform-container">
        <h2>PATIENTS</h2>
        <TextField
          onChange={(e) => searchPatient(e.target.value)}
          className="search-p"
          id="outlined-basic"
          label="Search for Patient by name phone or email"
          variant="outlined"
          fullWidth
        />
        {searchInput.length > 0 ? (
          <div className="all-patient-container-d">
            {filtered.map((patient) => (
              <div class="card-container-patient">
                <img src={doc} alt="" />
                <div className="pat-info-claron-docs">
                  <p className="p-name-c">
                    {patient.firstname} {patient.lastname}
                  </p>
                  <p className="p-title-doc">
                    <span>{patient.phone}</span>
                  </p>
                  <p className="p-title-doc">
                    <span>{patient.email}</span>
                  </p>
                  <button
                      className="add-lab-test-btn"
                      onClick={() => handleOpenModal(patient.email)}
                    >
                      Add Drug for Patient
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="all-patient-container">
            {patientsData && patientsData.length ? (
             patientsData.slice(0,visible).map((patient) => (
                <div class="card-container-patient">
                  <img src={doc} alt="" />
                  <div className="pat-info-claron-docs">
                    <p className="p-name-c">
                      {patient.firstname} {patient.lastname}
                    </p>
                    <p className="p-title-doc">
                      <span>{patient.phone}</span>
                    </p>
                    <p className="p-title-doc">
                      <span>{patient.email}</span>
                    </p>
                    <button
                      className="add-lab-test-btn"
                      onClick={() => handleOpenModal(patient.email)}
                    >
                      Add Drug for Patient
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
             {data &&<>
              <button onClick={showMore} className='view-more-btn'>View More</button>
              <div ref={messagesEndRef} />
             </> } 
          </div>
        )}
      </div>

      <Dialog open={openModal} fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className='lab-head'
          >
            Add Drugs For Patient
            <IconButton onClick={() => setOpenModal(false)}>
              <FiX />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DocDrugs email={patientEmail} drugs={drugs}/>
        </DialogContent>
      </Dialog>
    </DoctorLayout>
  );
}

export default PrescribeDrugs;
