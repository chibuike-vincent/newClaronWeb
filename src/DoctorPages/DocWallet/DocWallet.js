import React from 'react'
import DoctorLayout from '../../Pages/DoctorLayout';
// import bookingChart from '../../images/booking-chart.PNG'
// import EarningChart from '../../images/earnings-chat.PNG'
import BookingGraph from "../GraphComponents/BookingGraph"
import EarningGraph from '../GraphComponents/EarningGraph';
import './DocWallet.css'
function DocWallet() {
  return (
    <DoctorLayout>
      <div class="wallet-container">
        <div class="wallet-boxes">
          <div class="wallet-box box-w">
            <h6>Wallet Balance</h6>
            <h1>GHS 500.00</h1>

            <div class="withdraw-date-container">
              <span>last cashout Apr 19, 2021</span>
              <button className='withdraw-funds-btn'>Place Withdrawal</button>
            </div>

          </div>

        </div>
        <div class="earning-overview-container">
          <div class="wallet earning-container">
          <h2>EARNINGS OVERVIEW</h2>
          <EarningGraph/>
          </div>
          <div class="wallet-booking-overview">
            <h2>BOOKINGS OVERVIEW</h2>
            <BookingGraph/>
          </div>
        </div>
      </div>
    </DoctorLayout>

  )
}

export default DocWallet