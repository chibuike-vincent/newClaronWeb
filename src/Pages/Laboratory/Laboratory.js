import React, { useState, useEffect } from 'react'
import './Laboratory.css'
import Modal from 'react-modal'

import { Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom'
import MainLayout from '../MainLayout';
import 'date-fns';
import * as API from '../../Api/pharmacy'
import { getLabTestIndividual, getLabTestFacility } from '../../Api/lab'
import loading from '../../images/loading.gif'
import { useSelector } from 'react-redux'
const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
    },
    floatingLabelFocusStyle: {
        color: "#66cc99"
    },
    textField: {
        width: '90%',
        '.Mui-focused': {
            borderColor: 'yellow !important',
        }
    },
    tab: {
        color: "#525252",
        fontSize: '20px !important'
    },
}));

Modal.setAppElement('#root')

const Panel = (props) => (
    <div hidden={props.value !== props.index}>
        <Typography>{props.children}</Typography>
    </div>
);


function Laboratory() {
    // HANDLES DATE STATE
    const [index, setIndex] = useState(0);
    const onTabClicked = (event, index) => {
        setIndex(index);
    };

    const classes = useStyles();
    const userData = useSelector((state) => state.user.value)
    const [loaded, setLoaded] = useState(false)
    const [individual, setIndividual] = useState([])
    const [facility, setFacility] = useState([])

    console.log(userData)
    useEffect(() => {

        const getLab = async () => {
            setLoaded(true)
            // if (!loaded) {
                // try {
                    const dataIndividual = await getLabTestIndividual(userData.email);
                    const dataIndFacility = await getLabTestFacility(userData.email);

                    console.log(dataIndFacility,dataIndividual)

                    if(dataIndFacility || dataIndividual){
                        console.log(dataIndividual)
                        setIndividual(dataIndividual.requests)

                        
                        console.log(dataIndFacility)
                        setFacility(dataIndFacility.requests)
                        setLoaded(false)
                    }
                    

                // } catch (e) {
                //     console.log(e)
                // }
                
            }

            getLab()

        // })()
    }, [])
    return (
        <MainLayout>
            <div class="lab-wrapper">
                <div class="lab-header">
                    <h2>LABORATORY REQUEST OVERVIEW</h2>
                    <Link to="/facilityrequest" className="facility-btn lab-text">LABORATORY REQUEST</Link>
                </div>

                <div class="box-wrapper">
                    <div class="box-one box-lab">
                        <div className='upcoming-num'>{individual.length}</div>
                        <p>Pending Individual Request</p>
                    </div>

                    <div class="box-two box-lab">
                        <div className='pending-num'>0</div>
                        <p>Completed Individual Request</p>
                    </div>

                    <div class="box-three box-lab">
                        <div className='completed-num'>{facility.length}</div>
                        <p>Pending Facility Request</p>
                    </div>

                    <div class="box-four box-lab">
                        <div className='cancelled-num'>0</div>
                        <p>Completed Individual Request</p>
                    </div>
                </div>

                    
                        <div>
                            <Tabs style={{marginTop: "30px"}} value={index} onChange={onTabClicked}>
                                <Tab className={classes.tab} label="Individual" />
                                <Tab className={classes.tab} label="Facility" />
                            </Tabs>
                            <div class="history-content">
                                
                                <Panel value={index} index={0}>
                                    <div className="top-history-container">
                                        <div class="row-his">
                                            <div className="column-his-1">
                                                <div class="col-container">
                                                    {individual.length > 0 && (individual.length ? (
                                                        <div class="his-container-cont-lab">
                                                            {individual.map((item) => (
                                                                <>
                                                                    <div className='single-ambulance'>
                                                                        <div>
                                                                            <p style={{ color: '#2d8f88' }}>REQUESTED TESTS</p>
                                                                            {item.labTests.map(test => (
                                                                                <div className='request-test'>
                                                                                    <p>{test.labtest}</p>
                                                                                    <p>GHSsss {test.charge}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className='divider'></div>
                                                                        <div className='booked-container'>
                                                                            <p className='a-head'>Booked On:</p>
                                                                            <p>{new Date(item.createDate).toString().substring(0, 21)}</p> </div>
                                                                        <div className='booked-container'>
                                                                            <p className='a-head'>Booked For: </p>
                                                                            <p>{new Date(item.scheduledFor).toString().substring(0, 21)}</p> </div>

                                                                    </div>
                                                                </>
                                                            ))}

                                                        </div>
                                                    ) : (<img src={loading} alt="" className="loader-img" />))}
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                </Panel>



                                <Panel value={index} index={1}>
                                    <div className="top-history-container">
                                        <div class="row-his">
                                            <div className="column-his-1">
                                                <div class="col-container">
                                                    {facility.length > 0 && (facility.length ? (
                                                        <div class="his-container-cont-lab">
                                                            {facility.map((item) => (
                                                                <>
                                                                    <div className='single-ambulance'>
                                                                        <div>
                                                                            <p style={{ color: '#2d8f88' }}>REQUESTED TESTS</p>
                                                                            {item.labTests.map(test => (
                                                                                <div className='request-test'>
                                                                                    <p>{test.labtest}</p>
                                                                                    <p>GHS {test.charge}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className='divider'></div>
                                                                        <div className='booked-container'>
                                                                            <p className='a-head'>Booked On:</p>
                                                                            <p>{new Date(item.createDate).toString().substring(0, 21)}</p> </div>
                                                                        <div className='booked-container'>
                                                                            <p className='a-head'>Booked For: </p>
                                                                            <p>{new Date(item.scheduledFor).toString().substring(0, 21)}</p> </div>

                                                                    </div>
                                                                </>
                                                            ))}

                                                        </div>
                                                    ) : (<img src={loading} alt="" className="loader-img" />))}
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                </Panel>
                            </div>
                        </div>
                    </div>
        </MainLayout>
    )
}

export default Laboratory
