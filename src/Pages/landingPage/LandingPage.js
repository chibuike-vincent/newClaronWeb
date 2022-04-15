import React from 'react'
import homeImage from '../../images/home-img.svg'
import './LandingPage.css'
import 'aos/dist/aos.css'
import Navbar from '../../Component/Navbar/Navbar'


function LandingPage() {

    return (
        <>
        <Navbar/>
        <div className="landing-container">
            <section className="landing-page-home">
                <div className="landingpage-image">
                    <img src={homeImage} alt="home" className='home-img'/>
                </div>
                <div className="landing-page-content">
                    <h3>Skip the travel! Take Online Doctor Consultation</h3>
                    <p>ClaronDoc is a leading digital health organization which connect patients with top healthcare professionals.</p>
                </div>
            </section>
        </div>
        </>
    )
}

export default LandingPage
