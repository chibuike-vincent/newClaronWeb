import React, { useState } from 'react'
import DoctorLayout from '../../Pages/DoctorLayout';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useLocation, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { FaTimes } from "react-icons/fa";

import {firebaseApp} from '../../firebaseConfig';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function Availability() {
  const available = ['06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'];
  // Search State
  const { state } = useLocation();
  const navigate = useNavigate()
  const [date, setDate] = useState()
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState()
  const [open, setOpen] = useState(true);
  const [loading, setloading] = useState(false)
  const [checked, setChecked] = useState([]);

  const handleGoBack = () => {
      navigate("/doctorDashboard")
  }


  // UPDATE AVAILABILITY FUNCTION
  const updateAvailbility = async()=>{
    setloading(true)
    try {
      const user = localStorage.getItem('user')

      await firebaseApp.firestore().collection('newMyAvail').doc(user.email).set({date_entry: checked});
      swal({
        title: `Availability Updated`,
        text: "You Have set a new Availability",
        icon: "success",
    })
    } catch (error) {
      console.log(error)
    }
    setloading(false)
  }


  // Add/Remove checked item from list
const handleCheck = (event) => {
  var updatedList = [...checked];
  if (event.target.checked) {
    updatedList = [...checked, event.target.value];
  } else {
    updatedList.splice(checked.indexOf(event.target.value), 1);
  }
  setChecked(updatedList);
};

console.log(checked,'time...')
  return (
    <DoctorLayout>
       <Modal
                 open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                fullWidth
                className="modal-book-container"

            >
                <Box sx={style} style={{ width: 1000 }} className="modal-book-container" >
                    <div class="close-avali-container">
                        <h2 style={{ marginBottom: 20 }}> Availability</h2>
                        <FaTimes className='cloxe' onClick={() => handleGoBack()}/>
                    </div>


                    <div>
                        <TextField
                            id="date"
                            label="Book Date"
                            type="date"
                            className='avilability-booking-input'
                            value={date}
                            fullWidth
                            onChange={(e) => setDate(e.target.value)}
                            sx={{ width: 400 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <h4 style={{ marginTop: 20, marginBottom: 10 }}> Select Your Availabilty Time</h4>
                        <div className="time-availability">
                            {available.map((t, index) => (
                                <div className='time-btn-contaner'>
                                  {/* <div
                                  onClick={() => settime_selected((oldArray) => [...oldArray, "foo"])}
                                  className='time-btn'>{t}</div> */}
                                  
                                    <input
                                    value={t} type="checkbox" onChange={handleCheck} 
                                     
                                       className="radio-input" name="claron-radio" id={index} />
                                    <label className='time-btn' htmlFor={index}>{t}</label>
                                </div>

                            ))}
                        </div>

                        <p style={{ color: 'red' }}>{error ? error : ''}</p>
                        <Button disabled={loading} onClick={()=>updateAvailbility()}  style={{ marginTop: 20, background: '#16a085' }} variant="contained">{loading ? 'LOADING': 'SAVE AVAILABILITY'}</Button>
                    </div>
                </Box>
            </Modal>

    </DoctorLayout>
  )
}
export default Availability