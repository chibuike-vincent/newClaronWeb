import React,{useEffect} from 'react'
import homeImage from '../../images/home-img.svg'
import doc2 from '../../images/claron-2.jpeg'
import playstore from '../../images/playstore.png'
import call from '../../images/help-call.jpg'
import './LandingPage.css'
import 'aos/dist/aos.css'
import Aos from 'aos'
import Navbar from '../../Component/Navbar/Navbar'

function LandingPage() {
    useEffect(() => {
        Aos.init()
    }, [])
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

            {/* <footer>
                <p>© 2020 ClaronDoc. All rights reserved.</p>
            </footer> */}
        </div>
        </>
    )
}

export default LandingPage
