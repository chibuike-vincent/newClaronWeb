import React, {useEffect, useState} from 'react';
import Switch from '@mui/material/Switch';
import * as API from "../../Api/DoctorApi";

const label = { inputProps: { 'aria-label': 'okaye' } };

export default function SwitchesSize() {
  const [checked, setChecked] = React.useState();

    useEffect(() => {
      const status = localStorage.getItem("doctor-status")
      let checkedValue = status === "Online" ? true : false
      setChecked(checkedValue)
    }, [])

  const changeStatus = async(status) => {
    
    let statusState;
    if(status === true){
      statusState = "Online"
      localStorage.setItem("doctor-status", "Online")
    }else{
      statusState = "Offline"
      localStorage.setItem("doctor-status", "Offline")
    }
    
    await API.changeStatus(statusState);
      
  }

  const handleChange = (event) => {
    setChecked(event.target.checked)
    changeStatus(event.target.checked)
  };

  return (
    <div>
      <Switch
      checked={checked }
      onChange={(e) => handleChange(e)}
      inputProps={{ 'aria-label': 'controlled' }}
    />
    </div>
  );
}