import React, { useState, useEffect } from 'react'
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
// import './DoctorNotification.css'
import './Consultations.css'
import DoctorLayout from '../../Pages/DoctorLayout';
import * as API from "../../Api/DoctorApi";
import moment from 'moment';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
function Consultations() {
  const [schedules, setSchedules] = useState([])
  const [loaded, setLoaded] = useState(false);
  const [names, setNames] = useState([]);
  const [message, setMessage] = useState();
  const [Aloading, setALoading] = useState(false);
  const [Rloading, setRLoading] = useState(false);
  const [color, setColor] = useState("");
  const [total, setTotal] = useState(null);

  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    const getPatints = async () => {
      setLoaded(true);
      const res = await API.getSchedule();
      console.log(res, "ress")
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
                label="Date desktop"
                inputFormat="MM/dd/yyyy"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
          </LocalizationProvider>
          </div>
          
          {
            schedules && schedules.length ? schedules.map((item, index) => (
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
                            <div className="accept"><FaPhoneAlt/></div>
                            <div className="reject"><FaVideo/></div>
                            <button className='cancel-btn-book'>Cancel Appointment</button>
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

