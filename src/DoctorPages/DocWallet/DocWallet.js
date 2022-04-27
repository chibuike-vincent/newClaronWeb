import React from 'react'
import DoctorLayout from '../../Pages/DoctorLayout';
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
              <button className='withdraw-funds-btn'>Place Withdraw</button>
            </div>

          </div>

        </div>
        <div class="earning-overview-container">
          <h2>EARNINGS OVERVIEW</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A, sint!</p>
          <h2>BOOKINGS OVERVIEW</h2>
        </div>

      </div>
    </DoctorLayout>

  )
}

export default DocWallet