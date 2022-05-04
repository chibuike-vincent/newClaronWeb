import React, { useEffect, useState } from 'react'
import './Profile.css'
import profile from '../../images/user.png'
import MainLayout from '../../Pages/MainLayout'

import { Link, useNavigate } from "react-router-dom"
// ICONS IMPORT
import { FaPhoneAlt, FaEye } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaCcAmazonPay } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { useSelector } from 'react-redux'

const prices = []
prices['Basic'] = 20
prices['Premium'] = 40
prices['Family'] = 100

function Profile() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value)
    const editPage = () => {
        navigate('/Editpatient', { state: { user: user } });
    }
    return (
        <MainLayout>
            <div className="patient-profile-container">
                <div class="patient-details-container">

                    <div class="patient-profile-pic">
                        <h4>MY PROFILE</h4>
                        <img src={user.avatar !== "undefined" ? user.avatar : profile} alt="" />
                        <h4>{user ? user.firstname : ''} {user ? user.lastname : ''}</h4>
                    </div>

                    <div className='info-container'>
                        <p><FaPhoneAlt className="pat-icon" />{user ? user.phone : ''}</p>
                        <p><FaMapMarkerAlt className="pat-icon" />Ghana</p>
                        <p> <FaEnvelope className="pat-icon" />{user ? user.email : ''}</p>
                      
                            <p className="plan-title"> <FaCcAmazonPay className="pat-icon" />Subscription Plan: <span className="sub-card">{user ? user.subscription : ''}</span> </p>
                            {/* <p className="sub-card"> </p> */}
                       
                    </div>

                    <div class="plan-profile">


                        <button
                            onClick={() => { user.subscription != null && user.subscription != 'Normal' ? navigate('/Sub-Summary', { state: { name: `${user.subscription} Plan`, id: '', price: prices[user.subscription] } }) : navigate("/userDashboard") }}
                            className="upgrad-btn txt"> {user.subscription != null && user.subscription != 'Normal' ? `Continue with ${user.subscription} Plan` : 'Try ClaronDoc free for 14 days'}</button>


                        <button onClick={() => { editPage() }}>
                            <button className="edit-btn txt"> Edit Profile</button>
                        </button>

                        <div>
                            <Link to="/SavedDoctors">
                                <button className="saved-btn txt">   View Saved Doctors</button>
                            </Link>
                        </div>


                        <button onClick={() => navigate('/ChangePassword')}>
                            <button className="edit-btn txt"> Update Password</button>
                        </button>

                    </div>




                </div>
            </div>
        </MainLayout>
    )
}

export default Profile
