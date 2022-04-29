import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import './Consultations.css';
import DoctorLayout from '../../Pages/DoctorLayout';
import * as API from "../../Api/DoctorApi";
import moment from 'moment';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useSelector} from 'react-redux';
import {useNavigate } from "react-router-dom";


function Consultations() {
  const [schedules, setSchedules] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loaded, setLoaded] = useState(false);
  const [names, setNames] = useState([]);
  const [message, setMessage] = useState();
  const [Aloading, setALoading] = useState(false);
  const [Rloading, setRLoading] = useState(false);
  const [color, setColor] = useState("");
  const [total, setTotal] = useState(null);
  const userData = useSelector((state) => state.user.value)
  const navigate = useNavigate()

  const [value, setValue] = React.useState(new Date());





  

  const handleChange = (newValue) => {
    setValue(newValue);
    const filter = schedules.filter(sch =>{
     return moment(sch.scheduledFor).format("YYYY-MM-DD") === moment(newValue).format("YYYY-MM-DD")
    })
    console.log(filter, newValue, "ddddddd")
    setFiltered(filter)
  };


  useEffect(() => {
    const getPatints = async () => {
      setLoaded(true);
      const res = await API.getSchedule();
      console.log(res.filter(i => i.createDate === Date.now()), "ress")
      if (res) {
        setSchedules(res);
        setLoaded(false);
      }
    };
    getPatints();
  }, []);

  const handleRejectSchedule = async (res, id) => {
    setRLoading(true);
    try {
      const response = await API.respondRequest(res, id);

      if (response.success) {
        setRLoading(false);
        setColor("green")
        setMessage("Response successfully sent.", "fffff");
      } else {
        setColor("red")
        setMessage(response.message, "fffff");
        setRLoading(false);
      }
    } catch (e) {
      setColor("red")
      setMessage(e.message, "rrrrrr");
      setRLoading(false);
    }
  }

  const handleAcceptSchedule = async (res, id) => {
    setALoading(true);
    try {
      const response = await API.respondRequest(res, id);

      if (response.success) {
        setALoading(false);
        setColor("green")
        setMessage("Response successfully sent.", "fffff");
      } else {
        setColor("red")
        setMessage(response.message, "fffff");
        setALoading(false);
      }
    } catch (e) {
      setColor("red")
      setMessage(e.message, "rrrrrr");
      setALoading(false);
    }
  }

  return (
    <>
      <DoctorLayout>

        <div class="container-notification-card">
          <h2 className="consultation-title-doc">YOUR CONSULTATIONS</h2>
          <div class="date-container">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Select Date"
                inputFormat="MM/dd/yyyy"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
          </LocalizationProvider>
          </div>
          
          {
            filtered && filtered.length ? filtered.map((item, index) => (
              <div className="reject-accept-container">
               <p className="user_id">CID: {item.cid}<span className="consult-n">Consult on:</span> <span className="consult-time">{moment(item.scheduledFor).format("YYYY-MM-DD hh:mm A")}</span></p>

                <div class="actions-doc-claron">
                    <p style={{fontSize:20}}>Patient:</p><span style={{fontSize:20, marginLeft: '-30px',color:'#636363'}}>{item.patient.fullName}</span>
                    {
                        
                        (moment(item.scheduledFor).format("YYYY-MM-DD hh:mm A") >= moment(new Date()).format("YYYY-MM-DD hh:mm A")) && item.status === "Pending" ? (
                            <>
                            <div onClick={() => handleRejectSchedule("Rejected", item.id)} className="accept-r">{Rloading ? "Processing..." : "Reject"}</div>
                            <div onClick={() => handleAcceptSchedule("Accepted", item.id)} className="reject-a">{Aloading ? "Processing..." : "Accept"}</div>
                            </>
                        ) : (moment(item.scheduledFor) >= moment(new Date())) && item.status === "Accepted" ? (
                            <>
                            <div className="reject"><FaVideo onClick={() => navigate("/video-call", { state: { mediaType: "video", doctor: userData, patientEmail: item.patient.email } })}/></div>
                            </>
                        ) : null
                        
                    }
                </div>

                <div class="date-created-container">
                  <p>Created on: {moment(item.createDate).format("YYYY-MM-DD hh:mm A")}</p>
                </div>
              </div>
            )) : schedules && !!schedules.length ? schedules.filter(i => moment(i.scheduledFor).format("YYYY-MM-DD") === moment(Date.now()).format("YYYY-MM-DD")).map((item, index) => (
              <div className="reject-accept-container">
               <p className="user_id">CID: {item.cid}<span className="consult-n">Consult on:</span> <span className="consult-time">{moment(item.scheduledFor).format("YYYY-MM-DD hh:mm A")}</span></p>

                <div class="actions-doc-claron">
                    <p style={{fontSize:20}}>Patient:</p><span style={{fontSize:20, marginLeft: '-30px',color:'#636363'}}>{item.patient.fullName}</span>
                    {
                        
                        (moment(item.scheduledFor).format("YYYY-MM-DD hh:mm A") >= moment(new Date()).format("YYYY-MM-DD hh:mm A")) && item.status === "Pending" ? (
                            <>
                            <div onClick={() => handleRejectSchedule("Rejected", item.id)} className="accept-r">{Rloading ? "Processing..." : "Reject"}</div>
                            <div onClick={() => handleAcceptSchedule("Accepted", item.id)} className="reject-a">{Aloading ? "Processing..." : "Accept"}</div>
                            </>
                        ) : (moment(item.scheduledFor) >= moment(new Date())) && item.status === "Accepted" ? (
                            <>
                            <div className="reject"><FaVideo onClick={() => navigate("/video-call", { state: { mediaType: "video", doctor: userData, patientEmail: item.patient.email } })}/></div>
                            </>
                        ) : null
                        
                    }
                </div>

                <div class="date-created-container">
                  <p>Created on: {moment(item.createDate).format("YYYY-MM-DD hh:mm A")}</p>
                </div>
              </div>
            )) : <p style={{ textAlign: 'center' }}>Loading...</p>
          }
        </div>
      </DoctorLayout>
    </>
  )
}

export default Consultations

