import React, { useState, useEffect } from "react";
import firebase from "../../firebaseConfig";
import "./AppointmentHistory.css";
import Modal from "react-modal";
import swal from "sweetalert";

import { Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MainLayout from "../MainLayout";
import moment from "moment";
import "date-fns";
import { myBookings, DeleteBooking, respondRequest } from "../../Api/doctors";
import loading from "../../images/loading.gif";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  floatingLabelFocusStyle: {
    color: "#66cc99",
  },
  textField: {
    width: "90%",
    ".Mui-focused": {
      borderColor: "yellow !important",
    },
  },
  tab: {
    color: "#525252",
    fontSize: "20px !important",
  },
}));

Modal.setAppElement("#root");

const Panel = (props) => (
  <div hidden={props.value !== props.index}>
    <Typography>{props.children}</Typography>
  </div>
);

function AppointmentHistory() {
  // HANDLES DATE STATE
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [index, setIndex] = useState(0);

  const onTabClicked = (event, index) => {
    setIndex(index);
    // filter(index)
  };

  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadinga, setloadinga] = useState(true);
  const [pending, setPending] = useState();

  useEffect(() => {
    const getBookings = async () => {
      setLoaded(true);

      let res = await myBookings();
      if (res) {
        setBookings(res.requests);
        setFiltered(
          res.requests.filter((booking) =>
            moment().isAfter(new Date(booking.scheduledFor))
          )
        );

        setUpcoming(
          res.requests.filter((booking) =>
            moment().isBefore(new Date(booking.scheduledFor))
          )
        );
        setLoaded(false);
      }
    };

    getBookings();
  }, []);

  const orderedItemNames = bookings.length > 0 ? bookings.filter((b) => b.status == "Pending") : [];

  //   const cancelAppointment = async (id) =>{
  //     try{
  //       setloadinga(true)
  //       const email = localStorage.getItem('email');
  //       await firebase.firestore().collection('deletedAppointment').doc(email).collection('list').add({id: id});
  //       swal({
  //         title: "Request successful",
  //         text: `Appointment Deleted Successfully`,
  //         icon: "success",
  //         button: "Ok",
  //     });
  //       await respondRequest('Rejected', id);

  //     }catch(e){
  //       console.log(e)
  //       setloadinga(false)
  //     }

  //   }

  return (
    <MainLayout>
      <div class="ambulance">
        <div class="heading-container">
          <h2 class="ambulanc-heading">APPOINTMENTS REQUEST OVERVIEWS</h2>

          <div class="laboratory-container-btn"></div>
        </div>

        <div class="ambulance-container">
          <div class="appointment-container-box">
            <div class="appointment-box one">
              <div className="upcoming-num">{upcoming.length}</div>
              <p>Upcoming Appointments</p>
            </div>

            <div class="appointment-box two">
              <div className="pending-num">{orderedItemNames.length}</div>
              <p>Pending Appointments</p>
            </div>

            <div class="appointment-box four">
              <div className="cancelled-num">0</div>
              <p>Cancelled Appointments</p>
            </div>
          </div>
        </div>
        <p>Testing</p>
      </div>
    </MainLayout>
  );
}

export default AppointmentHistory;
