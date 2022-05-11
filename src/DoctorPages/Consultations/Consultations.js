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
import { useSelector, useDispatch} from 'react-redux';
import {useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import CallModal from '../Home/CallModal'
import {SCHEDULE} from "../../features/user"



function Consultations() {
  const [recentSchedules, setRecentSchedules] = useState([])
  const [schedules, setSchedules] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loaded, setLoaded] = useState(false);
  const [names, setNames] = useState([]);
  const [message, setMessage] = useState();
  const [Aloading, setALoading] = useState(false);
  const [AIdloading, setAIdLoading] = useState(null);
  const [Rloading, setRLoading] = useState(false);
  const [RIdloading, setRIdLoading] = useState(null);
  const [color, setColor] = useState("");
  const [total, setTotal] = useState(null);
  const userData = useSelector((state) => state.user.value)
  const DocSchedule = useSelector((state) => state.user.schedule)
  const navigate = useNavigate()
  const [value, setValue] = useState(new Date());
const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (newValue) => {
    setValue(newValue);
    dispatch(SCHEDULE({res:schedules, filter:newValue}))
  };

  useEffect(() => {
    const getPatints = async () => {
      setLoaded(true);
      const res = await API.getSchedule();
      if (res) {
        setSchedules(res);
        dispatch(SCHEDULE({res, filter:""}))
        setLoaded(false);
      }
    };
    getPatints();
  }, []);


  const handleRejectSchedule = async (res, id) => {
    setRLoading(true);
    setRIdLoading(id);
    try {
      const response = await API.respondRequest(res, id);

      if (response.success) {
        setRLoading(false);
        const res = await API.getSchedule();
        dispatch(SCHEDULE({res, filter:value}))
        setColor("green")
        setMessage("Response successfully sent.", "fffff");
      } else {
        setColor("red")
        setMessage(response.message, "fffff");
        setRLoading(false);
        setRIdLoading(null);
      }
    } catch (e) {
      setColor("red")
      setMessage(e.message, "rrrrrr");
      setRLoading(false);
      setRIdLoading(null);
    }
  }

  const handleAcceptSchedule = async (res, id) => {
    setALoading(true);
    setAIdLoading(id);
    try {
      const response = await API.respondRequest(res, id);

      if (response.success) {
        setALoading(false);
        const res = await API.getSchedule();
        dispatch(SCHEDULE({res, filter:value}))
        setColor("green")
        setMessage("Response successfully sent.", "fffff");
      } else {
        setColor("red")
        setMessage(response.message, "fffff");
        setALoading(false);
        setAIdLoading(null);
      }
    } catch (e) {
      setColor("red")
      setMessage(e.message, "rrrrrr");
      setALoading(false);
      setAIdLoading(null);
    }
  }


  const handleChangeResponse = async (res, id) => {

    const response = window.confirm("You previously rejected this request, do you want to change that?")

    if(response === true){
      return handleAcceptSchedule(res, id)
    }else{
      console.log("Cancel Pressed")
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
            schedules.length === 0 && loaded ? (
              <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : DocSchedule && DocSchedule.length ? DocSchedule.map((item, index) => (
              <div className="reject-accept-container">
               <p className="user_id">CID: {item.cid}<span className="consult-n">Consult on:</span> <span className="consult-time">{moment(item.scheduledFor).format("YYYY-MM-DD hh:mm A")}</span></p>

                <div class="actions-doc-claron">
                    <p style={{fontSize:20}}>Patient:</p><span style={{fontSize:20, marginLeft: '-30px',color:'#636363'}}>{item.patient.fullName}</span>
                    {
                        
                        (moment(item.scheduledFor).format("YYYY-MM-DD hh:mm A") >= moment(new Date()).format("YYYY-MM-DD hh:mm A")) && item.status === "Pending" ? (
                            <>
                            <div onClick={() => handleRejectSchedule("Rejected", item.id)} className="accept-r">{Rloading && RIdloading === item.id ? "Processing..." : "Reject"}</div>
                            <div onClick={() => handleAcceptSchedule("Accepted", item.id)} className="reject-a">{Aloading && AIdloading === item.id ? "Processing..." : "Accept"}</div>
                            </>
                        ) : (moment(item.scheduledFor) >= moment(new Date())) && item.status === "Accepted" ? (
                            <>
                            <div className="reject"><FaVideo onClick={() => navigate("/video-call", { state: { mediaType: "video", doctor: userData, patientEmail: item.patient.email } })}/></div>
                            </>
                        ) : (moment(item.scheduledFor).format("YYYY-MM-DD hh:mm A") >= moment(new Date()).format("YYYY-MM-DD hh:mm A")) && item.status === "Rejected" ? (
                          <>
                          <div onClick={() => handleChangeResponse("Accepted", item.id)} className="reject-a">{Aloading && AIdloading === item.id ? "Processing..." : "Change response"}</div>
                          </>
                      ) : null
                        
                    }
                </div>

                <div class="date-created-container">
                  <p>Created on: {moment(item.createDate).format("YYYY-MM-DD hh:mm A")}</p>
                </div>
              </div>
            )) : <p style={{ textAlign: 'center' }}>No consultation to display.</p>
          }
        </div>
        <button className='fixed-chat-icon'onClick={handleOpen} >Call</button>
        <CallModal handleOpen={handleOpen} handleClose={handleClose} open={open} setOpen={setOpen} />
      </DoctorLayout>
    </>
  )
}

export default Consultations

