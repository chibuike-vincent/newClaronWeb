import React, { useState, useEffect } from 'react';
import './Settings.css';
import docuser from '../../images/doc-1.jpg'
import DoctorLayout from '../../Pages/DoctorLayout';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import image from '../../images/user-profile.jpg'
import * as API from '../../Api/DoctorApi';
import {storage} from '../../firebaseConfig';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { useDispatch, useSelector } from 'react-redux'
import { UPDATE, UPDATEUSERINFO } from '../../features/user'
import FormLabel from '@mui/material/FormLabel';
import swal from 'sweetalert';
function Settings() {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.value)
  const [imgloading, setimgloading] = useState(false)
  const [progresspercent, setProgresspercent] = useState(0);
  const [user, setUser] = useState()
  const [error, seterror] = useState()
  const [loading, setloading] = useState(false)
  const [account, setaccount] = useState({
    firstname: '',
    lastname: '',
    seniority: '',
    avatar: '',
    department: '',
    bio: '',
    phoneNumber: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setaccount(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  useEffect(() => {
    (async () => {

      setaccount({ ...userData })

      const doc = await API.getuserDetails();

      console.log(doc)
    })()

  }, [])



  const ImageUpload = (e) => {
    setimgloading(true)
    e.preventDefault()
    const file = e.target?.files[0]

    console.log(file, "fffff")

    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          if (downloadURL) {
            console.log(downloadURL, "aaaaaaaaa")

          
           await API.update_physician_image({email:account.email, avatar: downloadURL})
        
            dispatch(UPDATEUSERINFO({ ...account, ...{ avatar: downloadURL} }))
            setaccount({ ...account, ...{ avatar: downloadURL } });
            swal({
              title: "Update",
              text: "Image updated successfully",
              icon: "success",
              button: "Ok",
            });
            setimgloading(false)
          }else {
            alert('error updating picture')
          }
        
          // setImgUrl(downloadURL)
        });
      }
    );
  }

  //   UPDATING DOCTOR RECORD
  const saveAccount = async () => {
    setloading(true)
    try {
      let data = await API.update_physician(account)
      if (data.success) {
        swal({
          title: "Update",
          text: "updated successfully",
          icon: "success",
          button: "Ok",
        });
      } else {
        alert('Update not successful')
      }
    } catch (error) {
      dispatch(UPDATEUSERINFO({ ...account, ...{ bio: account.bio, seniority: account.seniority, department: account.department } }))
      swal({
        title: "Update",
        text: "updated successfully",
        icon: "success",
        button: "Ok",
      });
    }

    setloading(false)
  }

  return (
    <DoctorLayout>
      <div className="settings-doc-container">
        <div className="doc-personal-detail-container">
          <h2>Personal Details</h2>
          <div className="doc-image-container">
            <img src={userData.avatar !== "undefined" ? userData.avatar : image} alt="" />
            <div class="parent-div">
              <button class="btn-upload" >{imgloading ? "loading..." : "Change Photo"}</button>
              <input onChange={(e) => ImageUpload(e)} type="file" name="upfile" />
            </div>
          </div>

          <div>


          </div>

          <Grid sx={{ mb: 1 }} container spacing={2}>

            <Grid full item xs={12} lg={6}>
              <label for="">First Name</label>
              <TextField
                disabled={true}
                name="firstname"
                onChange={handleChange}
                value={account.firstname}
                fullWidth id="outlined-basic" variant="outlined" />
            </Grid>

            <Grid item xs={12} lg={6}>
              <label for="">Last Name</label>
              <TextField
                disabled={true}
                name="lastname"
                onChange={handleChange}
                value={account.lastname}
                fullWidth id="outlined-basic" variant="outlined" />
            </Grid>
          </Grid>

          <Grid sx={{ mb: 1 }} container spacing={2}>
            <Grid item xs={6}>
              <label for="">Phone Number</label>
              <TextField
                disabled={true}
                name="phone"
                onChange={handleChange}
                value={account.phone}
                fullWidth id="outlined-basic" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <label for="">Speciality</label>
              <TextField
                name="department"
                onChange={handleChange}
                value={account.department}
                fullWidth id="outlined-basic" variant="outlined" />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <label for="">Seniority</label>
            <TextField
              name="seniority"
              onChange={handleChange}
              value={account.seniority}
              fullWidth id="outlined-basic" variant="outlined" />
          </Grid>
          <label for="" style={{ paddingBottom: 50 }}>Biography</label>
          <Grid item xs={12}>
            {/* 
                        <TextareaAutosize
                            sx={{ mb: 2 }}
                            aria-label="empty textarea"
                            placeholder="Empty for know"
                            name="bio"
                            onChange={handleChange}
                            value={account.bio}
                            style={{ width: '100%' }}
                        /> */}

            <TextField
              name="bio"
              onChange={handleChange}
              value={account.bio}
              fullWidth id="outlined-basic" variant="outlined" />

          </Grid>

          <Grid sx={{ mt: 1 }}>
            <Button
            className="btn-doc-update"
            onClick={saveAccount} variant="contained">Save Changes</Button>
          </Grid>


        </div>
      </div>
    </DoctorLayout>
  )
}

export default Settings
