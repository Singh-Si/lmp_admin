import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CWidgetStatsC } from '@coreui/react';
import { CCol } from '@coreui/react';
import { Accordion, Col, Tabs } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import { CChartBar } from '@coreui/react-chartjs';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';
// let socket = io('https://lmp.handsintechnology.in');

AdminAndControl.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes
    })
};

AdminAndControl.propTypes =
{
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.string,
        defaultlob: PropTypes.string,
        defaultbusinessType: PropTypes.string,
        defaultagent: PropTypes.string,
        defaultdateRange: PropTypes,
        startdate: PropTypes,
        enddate: PropTypes,
    })
};

AdminAndControl.propTypes =
{
    updateSharedData: PropTypes.func.isRequired,
};
function AdminAndControl({ filterOptions, defaultOptions, updateSharedData }) {
    const navigate = useNavigate()
    const [totalVisits, setTotalVisits] = useState(0)

    const [visitorCount, setVisitorCount] = useState({ registered: 0, unregistered: 0, total: 0 })
    const [policiesSold, setPoliciesSold] = useState({})
    const [quotesCount, setQuotesCount] = useState(0)
    const [perlobCount, setPerLobCount] = useState({})
    const [peripcount, setPerIpCount] = useState([])
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [blockedIps, setBlockedIps] = useState([])
    const [lobViseVisitors, setLobViseVisitors] = useState({})
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            // getpidashboardcount()
            perDayvisits()
            QuotesCounterByLOB()
            TotalNumberofVisitors()
            QuotesCounterbyIP(page, perPage)
            GetBlockedIps()
            getLobviseVisitors()
            // getpileads(page, perPage);
        }
    }, [filterOptions]);

    useEffect(() => {
        // Listen for active clients count from the server
        const socket = io('https://lmp.handsintechnology.in', {
            query: {
                userType: 'Admin', // or 'unregistered'
            },
        });

        // Optionally handle updates from the server
        socket.on('updateUserCount', (data) => {
            setVisitorCount({
                registered: data.registered,
                unregistered: data.unregistered,
                total: data.unregistered + data.registered,
                Motor: data.liveOnMotor,
                Yacht: data.liveOnYacht,
                Travel: data.liveOnTravel,
                Home: data.liveOnHome,
                Medical: data.liveOnMedical
            })

            // Update your admin panel UI with the new counts
        });
    }, []);

    // const getpidashboardcount = () => {
    //     const requestOptions =
    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },

    //     };
    //     fetch(`https://lmp.handsintechnology.in/api/SoldLobsperday`, requestOptions)
    //         .then(response => response.json())
    //         .then(data => {
    //             let resdata = data.data
    //             console.log(resdata,"res dataaaaaaaa")
    //             setPoliciesSold(resdata[0])

    //         });
    // }
    const perDayvisits = () => {
        let dateRange = filterOptions.dateRange;
        let startdate = defaultOptions.startdate;
        let enddate = defaultOptions.enddate;
        let newlocation = filterOptions.location
        let newlob = filterOptions.lob
        let newbusinessType = filterOptions.businessType
        const requestOptions =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                location: newlocation,
                lob: newlob,
                business_type: newbusinessType,
                dateRange: dateRange,
                startdate: startdate,
                enddate: enddate
            }),

        };
        fetch(`https://lmp.handsintechnology.in/api/SoldLobsperday`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let resdata = data.data
                setPoliciesSold(resdata[0])

            });
    }
    const QuotesCounterByLOB = () => {
        let dateRange = filterOptions.dateRange;
        let startdate = defaultOptions.startdate;
        let enddate = defaultOptions.enddate;
        // let newlocation = filterOptions.location
        // let newlob = filterOptions.lob
        // let newbusinessType = filterOptions.businessType
        const requestOptions =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // location: newlocation,
                // lob: newlob,
                // business_type: newbusinessType,
                dateRange: dateRange,
                startdate: startdate,
                enddate: enddate
            }),

        };
        fetch(`https://lmp.handsintechnology.in/api/getTodaysQuotesGeneratedbyLOB`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let resdata = data.data
                setQuotesCount(resdata[0]?.totalQuotesOverall)
                let lobcount = resdata[0]?.detailsByLob
                let obj = {
                    Motor: lobcount?.find((item) => item.lobName == "Motor") ? lobcount?.find((item) => item.lobName == "Motor")?.totalQuotes : 0,
                    Yacht: lobcount?.find((item) => item.lobName == "Yacht") ? lobcount?.find((item) => item.lobName == "Yacht")?.totalQuotes : 0,
                    Travel: lobcount?.find((item) => item.lobName == "Travel") ? lobcount?.find((item) => item.lobName == "Travel")?.totalQuotes : 0,
                    Home: lobcount?.find((item) => item.lobName == "Home") ? lobcount?.find((item) => item.lobName == "Home")?.totalQuotes : 0,
                    Medical: lobcount?.find((item) => item.lobName == "Medical") ? lobcount?.find((item) => item.lobName == "Medical")?.totalQuotes : 0,
                }
                console.log(obj, ">>>>>>>>> obj")
                setPerLobCount(obj)

            });
    }
    const QuotesCounterbyIP = (page, perPage) => {
        let dateRange = filterOptions.dateRange;
        let startdate = defaultOptions.startdate;
        let enddate = defaultOptions.enddate;
        // let newlocation = filterOptions.location
        let newlob = filterOptions.lob
        // let newbusinessType = filterOptions.businessType
        const requestOptions =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                lob: newlob,
                page: page,
                limit: perPage,

                dateRange: dateRange,
                startdate: startdate,
                enddate: enddate
            }),

        };
        fetch(`https://lmp.handsintechnology.in/api/getTodaysQuotesGeneratedbyIP`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let resdata = data.data
                console.log(data, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ressssssssssssponsee")
                const total = data.count;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setPerIpCount(resdata)

            });
    }
    const TotalNumberofVisitors = () => {
        let dateRange = filterOptions.dateRange;
        let startdate = defaultOptions.startdate;
        let enddate = defaultOptions.enddate;
        const requestOptions =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dateRange: dateRange,
                startdate: startdate,
                enddate: enddate
            })

        };
        fetch(`https://lmp.handsintechnology.in/api/getClientsVisits`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let resdata = data.count
                setTotalVisits(resdata)

            });
    }
    
    const SendIPtoBlock = (ip,blockstatus) => {
        const token = localStorage.getItem('token');
        const requestOptions =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                ip_address: ip,
                blockstatus: blockstatus
            })

        };
        fetch(`https://lmp.handsintechnology.in/api/blockIPaddress`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        message: data.message,
                        type: "Success"
                    })
                } else {
                    swal({
                        message: data.message,
                        type: "Error"
                    })
                }

            });
    }
    const GetBlockedIps = () => {
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        };
        fetch(`https://lmp.handsintechnology.in/api/getBlockedIPs`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // console.log(data.data, "blocked ips")
                setBlockedIps(data.data)

            });
    }
    const getLobviseVisitors = () => {
        try {
            const requestOptions =
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            };
            fetch(`https://lmp.handsintechnology.in/api/getLobviseVisitors`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // console.log(data.data, "blocked ips")
                    setLobViseVisitors(data.data)

                });
        } catch (error) {
            console.log(error)
        }
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        QuotesCounterbyIP(selectedPage + 1, perPage);
    };
    return (
        <div>

            <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <div style={{ position: 'relative' }} className="card-header new_leads">
                            <strong>Admin & Control</strong>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                        <row className='d-flex'>
                            <CCol style={{ height: '150px' }}>
                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"Current number of visitors on website"}
                                    value={<span className='d-flex'><p>All - </p><p style={{ color: 'red' }}>{visitorCount.total}</p>
                                        <p className='mx-2'>Registered - </p><p style={{ color: 'red' }}>{visitorCount.registered}</p>
                                    </span>}
                                />
                            </CCol>
                            <CCol style={{ height: '150px' }}>
                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"Total number of visitors"}
                                    value={<p style={{ color: 'red' }}>{totalVisits}</p>}
                                />
                            </CCol>


                        </row>
                        <row className='d-flex'>
                            <Col className='mx-2' lg={6}>
                                <CCard className="mb-4">
                                    <CCardHeader><label className='d-flex' ><h4 style={{ color: '#003396' }}>Number of policies sold</h4></label></CCardHeader>
                                    <CCardBody >
                                        <CChartBar

                                            options={{
                                                scales: {
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: 'Line Of Business',
                                                        },
                                                    },

                                                },
                                            }}
                                            data={{
                                                labels: ['Motor', 'Yacht', 'Travel', 'Home', 'Medical'],
                                                datasets: [
                                                    {
                                                        label: 'No. of Policies sold',
                                                        backgroundColor: '#f87979',
                                                        data: [policiesSold?.Motor ? policiesSold?.Motor : 0, policiesSold?.Yacht ? policiesSold?.Yacht : 0,
                                                        policiesSold?.Travel ? policiesSold?.Travel : 0,
                                                        policiesSold?.Home ? policiesSold?.Home : 0,
                                                        policiesSold?.Medical ? policiesSold?.Medical : 0],
                                                    },
                                                ],
                                            }}
                                        />

                                    </CCardBody>
                                </CCard>
                            </Col>
                            <Col className='' lg={6}>
                                <CCard className="mb-4">
                                    <CCardHeader><label className='d-flex' ><h4 style={{ color: '#003396' }}>Number of quotes generated /LOB - </h4>
                                        <h4 style={{ color: '#ed1c24' }}> {quotesCount}</h4></label></CCardHeader>
                                    <CCardBody>
                                        <CChartBar
                                            options={{
                                                scales: {
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: 'Line Of Business',
                                                        },
                                                    },

                                                },
                                            }}
                                            data={{
                                                labels: ['Motor', 'Yacht', 'Travel', 'Home', 'Medical'],
                                                datasets: [
                                                    {
                                                        label: 'No. of quotes generated',
                                                        backgroundColor: '#f87979',
                                                        data: [perlobCount.Motor, perlobCount.Yacht, perlobCount.Travel,
                                                        perlobCount.Home, perlobCount.Medical],
                                                    },
                                                ],
                                            }}
                                        />



                                  </CCardBody>
                              </CCard>
                          </Col>
                      </row>
                      <hr/>
                      <row>
                          <span style={{ color: '#003396' }}><h4>Number of quotes generated / IP Address</h4></span>
                          <div className="table-responsive">
                              <table className="table table-bordered">
                                  <thead>
                                      <tr>
                                          <th>IP address</th>
                                          <th>Line Of Buisness</th>
                                          <th>Total</th>
                                          <th>Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {peripcount?.map((item, indx) => 
                                          
                                          <tr key={indx}>
                                          <td>{item.ip_address}</td>
                                          <td>{item?.lobs?.map((itm, ind) => <p key={ind}>{itm.lob} - {itm.totalQuotes}</p>)}</td>
                                          <td>{item.totalQuotes}</td>
                                              <td>{blockedIps?.includes(item.ip_address) ? <div
                                                  onClick={() => { if (window.confirm('Are you sure you wish to Unblock this IP address?')) SendIPtoBlock(item.ip_address,'unblock') }}
                                                  className='btn btn-success'>Unblock</div> : <div
                                                      onClick={() => { if (window.confirm('Are you sure you wish to block this IP address?')) SendIPtoBlock(item.ip_address,'block') }}
                                                      className='btn btn-danger'>Block</div>}</td>
                                      </tr>
                                      
)
                                      }
                                  </tbody>
                              </table>
                              <section>
                                  <ReactPaginate
                                      previousLabel={"Previous"}
                                      nextLabel={"Next"}
                                      breakLabel={"..."}
                                      pageCount={pageCount}
                                      marginPagesDisplayed={1}
                                      pageRangeDisplayed={1}
                                      onPageChange={handlePageClick}
                                      containerClassName={"pagination justify-content-end"}
                                      pageClassName={"page-item"}
                                      pageLinkClassName={"page-link"}
                                      previousClassName={"page-item"}
                                      previousLinkClassName={"page-link"}
                                      nextClassName={"page-item"}
                                      nextLinkClassName={"page-link"}
                                      breakClassName={"page-item"}
                                      breakLinkClassName={"page-link"}
                                      activeClassName={"active"}
                                  />
                              </section>
                             
                              </div>
                          {/* <CCol lg={4} style={{ height: '250px' }}>
                              <CWidgetStatsC
                                  className="m-3 p-3"
                                  style={{ fontSize: '16px', fontWeight: '600' }}
                                  progress={{ color: 'primary', value: 100 }}
                                  text="Widget helper text"
                                  title={"•	Number of quotes generated"}
                                  value={<span >
                                      <span className='d-flex'>
                                          <p>Motor -  </p><p style={{ color: 'red' }}> {quotesCount?.motor_quotes?.length}</p>
                                          <p className='mx-2'>Yacht - </p><p style={{ color: 'red' }}> {quotesCount?.yacht_quotes?.length}</p>
                                          <p className='mx-2'>Home - </p><p style={{ color: 'red' }}> {quotesCount?.home_quotes?.length} </p>
                                      </span>
                                      <span className='d-flex'>
                                          <p className='mx-2'>Travel -  </p><p style={{ color: 'red' }}> {quotesCount?.travel_quotes?.length}</p>
                                          <p className='mx-2'>Medical - </p><p style={{ color: 'red' }}> {quotesCount?.medical_quotes?.length}</p>
                                      </span>
                                  </span>}
                              />
                          </CCol> */}


                        </row>
                        <row>
                            <span style={{ color: '#003396' }}><h4>Current number of Visitors Viewing What Insurance</h4></span>
                            <div className='col-md-12 d-flex'>
                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"Motor"}
                                    value={<p style={{ color: 'red' }}>{visitorCount.Motor}</p>}
                                />

                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"Yacht"}
                                    value={<p style={{ color: 'red' }}>{visitorCount.Yacht}</p>}
                                />

                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"Travel"}
                                    value={<p style={{ color: 'red' }}>{visitorCount.Travel}</p>}
                                />

                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"Home"}
                                    value={<p style={{ color: 'red' }}>{visitorCount.Home}</p>}
                                />

                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"Medical"}
                                    value={<p style={{ color: 'red' }}>{visitorCount.Medical}</p>}
                                />
                            </div>

                        </row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default AdminAndControl
