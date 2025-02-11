import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

ProducerUpcomingRenewal.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes

  })
};

ProducerUpcomingRenewal.propTypes = {
  defaultOptions: PropTypes.shape({
    defaultlocation: PropTypes.string,
    defaultlob: PropTypes.string,
    defaultbusinessType: PropTypes.string,
    defaultagent: PropTypes.string,
    defaultdateRange: PropTypes,
    startdate: PropTypes,
    enddate: PropTypes,
    userType: PropTypes,
    selectedSupervisor: PropTypes


  })
};


function ProducerUpcomingRenewal({ filterOptions, defaultOptions }) {

  const navigate = useNavigate();
  const [newleaddata, setNewleadData] = useState([]);
  const [leadstatus, setLeadStatus] = useState([]);
  const [leaddetails, setLeadDetails] = useState([]);
  const [line_of_business_name, setLineOfBusinessName] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [agentid, setAgentId] = useState('');
  const [usertype, setUsertype] = useState('');
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getleadslist(page, perPage);
    }
  }, [filterOptions]);


  const getleadslist = async (page, perPage) => {
    const userdata = JSON.parse(localStorage.getItem('user'));

    let newlocation = filterOptions.location
    let newlob = filterOptions.lob
    let newbusinessType = filterOptions.businessType
    let newagent = filterOptions.agent
    let dateRange = filterOptions.dateRange
    let startdate = defaultOptions.startdate
    let enddate = defaultOptions.enddate
    let assign_staff = userdata.assign_staff;
    let usertype = defaultOptions.userType;
    let selectedsupervisor = defaultOptions.selectedSupervisor;

    if (newlocation == null || newlocation == undefined || !Array.isArray(newlocation) || newlocation.length === 0) {
      newlocation = defaultOptions.defaultlocation.map((item) => item.value);
      // newlocation = [];
    }
    else {
      newlocation = newlocation.map((item) => item.value);
    }

    if (newlob == null || newlob == undefined || !Array.isArray(newlob) || newlob.length === 0) {
      newlob = defaultOptions.defaultlob.map((item) => item.value);
      // newlob = [];
    }
    else {
      newlob = newlob.map((item) => item.value);
    }

    if (newbusinessType == null || newbusinessType == undefined || !Array.isArray(newbusinessType) || newbusinessType.length === 0) {
      newbusinessType = defaultOptions.defaultbusinessType.map((item) => item.value);
      // newbusinessType = [];

    }
    else {
      newbusinessType = newbusinessType.map((item) => item.value);
    }
    if (newagent == null || newagent == undefined || !Array.isArray(newagent) || newagent.length === 0) {
      newagent = defaultOptions.defaultagent.map((item) => item.value);
    }
    else {
      newagent = newagent.map((item) => item.value);
    }

    const token = localStorage.getItem('token');
    const loginuser = JSON.parse(localStorage.getItem('user'));
    const loginusertype = loginuser.usertype;

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        page: page,
        limit: perPage,
        location: newlocation,
        lob: newlob,
        business_type: newbusinessType,
        newagent: newagent,
        dateRange: dateRange,
        startdate: startdate,
        enddate: enddate,
        assign_staff: assign_staff,
        userType: usertype,
        selectedSupervisor: selectedsupervisor,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    };

    if (loginusertype == "66068569e8f96a29286c956e") {

      await fetch(`https://lmp.handsintechnology.in/api/get_supervisor_leads?producer=Renewal`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setNewleadData(list)
        })
        .catch((error) => {
          console.log(error)
        });
    }

    if (loginusertype == "64622470b201a6f07b2dff22") {

      await fetch(`https://lmp.handsintechnology.in/api/get_supervisor_leads?producer=Renewal&dashboardType=producerDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setNewleadData(list)
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }

  console.log(newleaddata)


  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getleadslist(selectedPage + 1, perPage, localStorage.getItem('lob'));
  };


  const handleEmailClick = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink);
  }

  const handleWhatsappClick = (phoneNumber) => {
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    window.open(whatsappLink);
  }

  const startFrom = (page - 1) * perPage;

  const sendData = (data) => {
    setAgentId(data)
  }

  const sendUsertype = (data1) => {
    setUsertype(data1)
  }

  const handleRenewalAssignAgent = async (id) => {

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ id: id, agent_id: agentid, user_type: usertype }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(`https://lmp.handsintechnology.in/api/supervisor_renewal_assigned_agent`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success",
            text: data.message,
            icon: "success",
            dangerMode: true,
          })
          getleadslist(page, perPage);
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const details = (id, lob) => {

    if (lob === 'Motor') {
      window.open(`/MotorLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Travel') {
      window.open(`/TravelLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Medical') {
      window.open(`/MedicalLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Home') {
      window.open(`/HomeLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Yacht') {
      window.open(`/YachtLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Other Insurance') {
      window.open(`/OtherInsuranceLeaddetails?id=${id}`, '_blank')
    }

  }


  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div style={{ position: 'relative' }} className="card-header new_leads">
              <strong>Upcoming Renewals</strong>
              {notificationCount > 0 ? <div className='dashboardNotify'><h6>{notificationCount}</h6></div> : ''}
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">Sr#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone No.</th>
                  <th scope="col">Email-ID</th>
                  <th scope="col">Nationality</th>
                  <th scope="col">Policy Type</th>
                  <th scope="col">LMP Pol.No.</th>
                  <th scope="col">Policy No.</th>
                  <th scope="col">Premium</th>
                  <th scope="col">Sales Advisor</th>
                  <th scope="col">Producer</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>

                {newleaddata.length > 0 ? (
                  newleaddata.map((item, index) => (

                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.name}</td>
                      <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                      <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td>
                      <td>{item.nationality}</td>



                      <td>{item['policy_type'][0]['line_of_business_name']}</td>
                      <td>{item.lead_id}</td>
                      <td>#5678</td>
                      <td>Rs. 1000</td>
                      <td>{item.assigned_agent_info != "" ? item.assigned_agent_info[0]?.name : "-"}</td>
                      <td>{item.producerdetail != "" ? item.producerdetail[0]?.name : "-"}</td>
                      <td className='buttons_icons1'>
                        <button className="btn btn-primary btn-sm " onClick={() => details(item._id, item.policy_type[0]?.line_of_business_name)}><i className='fa fa-eye'></i></button>
                      </td>

                    </tr>

                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      <strong>No Records Found</strong>
                    </td>
                  </tr>
                )
                }
              </tbody>
            </table>
            <section>
              {/* <button className='save-btn' onClick={handleassignedsubmit}>Save </button> */}
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default ProducerUpcomingRenewal;