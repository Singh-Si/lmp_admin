import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../../webroot/sample-files/medical-plan-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";


const Viewmedicalplantype = () => {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("");
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [medical_plan_type, setMedicalplantype] = useState('');
  const [medical_plan_type_status, setMedicalplantypestatus] = useState();
  const [medical_plan_type_id, setMedicalplantypeid] = useState('');
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [medicalpermission, setMedicalpermission] = useState([]);
  const [defaultLocation, setDefaultLocale] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getmedicalplantype(page, perPage);
      locationList();
      exportlistdata();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const medical_permission = userdata?.medical_permission?.[0] || {};
      setMedicalpermission(medical_permission);
    }
  }, [])

  const getmedicalplantype = async (page, perPage) => {
    setData([]);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://lmp.handsintechnology.in/api/get_medical_plan_type?page=${page}&limit=${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        console.log(">>>>>>>>>>>>>> this is list", list)
        setData(list)

      });
  }
  const [exportlist, setExportlist] = useState([]);
  const exportlistdata = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://lmp.handsintechnology.in/api/get_medical_plan_type', requestOptions)
      .then(response => response.json())
      .then(data => {
        setExportlist(data.data);
      });
  }
  const fileType = 'xlsx'
  const exporttocsv = () => {
    const updatedData = exportlist.map((item, index) => {
      return {

        'medical_plan_type': item.medical_plan_type,
        'medical_plan_type_location': item.medical_plan_type_location.map((item) => item.location_name).join(", "),
      }
    })

    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "Medical-Plan-Type" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getmedicalplantype(selectedPage + 1, perPage);
  };

  const updatestatus = async (id, medical_plan_type_status) => {
    let result = await fetch('https://lmp.handsintechnology.in/api/update_medical_plan_type_status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, medical_plan_type_status })
    })
    result = await result.json();
    swal("Success!", "Status Updated Successfully!", "success");
    getmedicalplantype(page, perPage);
  }

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    let result = await fetch("https://lmp.handsintechnology.in/api/read_medical_plan_type_excel ",
      {
        method: "post",
        body: fd,
      })
    result = await result.json()
    console.log(result, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> data")
    if (result.status === 200) {
      setVisible(!visible)
      swal({
        text: result.message,
        type: "success",
        icon: "success",
        button: false,
      })
      getmedicalplantype(page, perPage);
      setTimeout(() => {
        swal.close()
      }, 1000);
    }
    else {
      setVisible(!visible)
      swal({
        title: "Error!",
        text: result.message,
        type: "error",
        icon: "error",
        button: "ok",
      })
      getmedicalplantype(page, perPage);
      setTimeout(() => {
        swal.close()
      }, 1000);
    }

  }

  const locationList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://lmp.handsintechnology.in/api/get_location`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const locationdt = data.data;
        console.log(locationdt, "all locations")
        setLocation(locationdt);
        setSelectedOption(locationdt);

      });
  }

  const addmedicalplantype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const medical_plan_type = data.get('medical_plan_type');
    const medical_plan_type_location = selectedOption;
    const medical_plan_type_location_len = medical_plan_type_location.length;
    const medical_plan_type_location_str = [];
    for (let i = 0; i < medical_plan_type_location_len; i++) {
      medical_plan_type_location_str.push(medical_plan_type_location[i]._id);
    }

    await fetch('https://lmp.handsintechnology.in/api/add_medical_plan_type', {
      method: 'post',
      body: JSON.stringify({
        medical_plan_type: medical_plan_type,
        medical_plan_type_location: medical_plan_type_location_str,

      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          setShowModal(false);
          swal({
            text: data.message,
            type: "success",
            icon: "success",
            button: false,
          })
          getmedicalplantype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          setShowModal(false);
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error",
            button: false,
          })
          getmedicalplantype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  }

  const detailsbyid = async (ParamValue) => {
    setMedicalplantypeid(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://lmp.handsintechnology.in/api/get_medical_plan_type_detailsbyid`, requestOptions);
    result = await result.json();
    setMedicalplantype(result.data[0]?.medical_plan_type);
    setMedicalplantypestatus(result.data[0]?.medical_plan_type_status);
    const locationid = result.data[0]?.plan_type_location;
    console.log(locationid, ">>>>>>>>>>>>>>> id locations")
    setDefaultLocale(locationid);
    setVisibleedit(true);
  }



  const updatemedicalplantypelist = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const medical_plan_type = data.get('medical_plan_type');
    const medical_plan_type_location = selectedOption;
    await fetch(`https://lmp.handsintechnology.in/api/update_medical_plan_type_details`, {
      method: "POST",
      body: JSON.stringify({
        ParamValue: medical_plan_type_id,
        medical_plan_type: medical_plan_type,
        medical_plan_type_location: selectedOption,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          setVisibleedit(false)
          swal({
            text: data.message,
            type: "success",
            icon: "success",
            button: false,
          })
          getmedicalplantype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          setVisibleedit(false)
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error",
            button: false,
          })
          getmedicalplantype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }
  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://lmp.handsintechnology.in/api/deleteMedicalMaster/?id=${id}&type=medicalPlanType`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
          getmedicalplantype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: false,
          })
          getmedicalplantype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }

  const AddPlanType = () => {
    navigate("/Addmedicalplantype")
  }


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Plan Type Details</h4>
              </div>
              <div className="col-md-6">
                {medicalpermission.plan_type?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => AddPlanType()}>Add Plan Type</button>
                  : ''}
              </div>
            </div>
          </div>
          {/* <div className="card-header" style={{ textAlign: 'right' }}>
            {medicalpermission.plan_type?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {medicalpermission.plan_type?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {medicalpermission.plan_type?.includes('export') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
              : ''}
          </div> */}
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Type</th>
                  <th scope="col">Location</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.medical_plan_type}</td>
                        <td>{item.medical_plan_type_location?.map((val) => val.location_name).join(", ")}</td>
                        <td>
                          {medicalpermission.plan_type?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                          )}
                          {' '}
                          {medicalpermission.plan_type?.includes('delete') && (
                            <>
                              {
                                item.medical_plan_type_status === 1 ?
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                  <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                              }
                              <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                            </>
                          )}
                        </td>

                      </tr>
                    ) : <tr>
                      <td colSpan="6">No Data Found</td>
                    </tr>
                }
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
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
          </div>
        </div>

      </Container>

      <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Upload Excel File</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div >
            {/* <label className="form-label"><strong>Upload Excel File</strong></label> */}
            <input type="file" className="form-control" id="DHA" defaultValue="" required
              onChange={(e) => setExcelfile(e.target.files[0])} />
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
        </CModalFooter>
      </CModal>

      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Plan Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addmedicalplantype}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Add Plan Type</strong></label>
                          <input type='text' className="form-control"
                            name='medical_plan_type'
                            placeholder="Enter Plan Type"
                            defaultValue=""
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Select Location</strong></label>

                          <Multiselect
                            options={location}
                            selectedValues={selectedOption}
                            displayValue="location_name"
                            onSelect={setSelectedOption}
                            onRemove={setSelectedOption}
                            placeholder="Select Location"
                            showCheckbox={true}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Plan Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updatemedicalplantypelist}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Edit Plan Type</strong></label>
                          <input type='text' className="form-control"
                            name='medical_plan_type'
                            placeholder='Name'
                            defaultValue={medical_plan_type}
                            onChange={(e) => setMedicalplantype(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Select Location</strong></label>

                          <Multiselect
                            options={location}
                            selectedValues={defaultLocation}
                            onSelect={setSelectedOption}
                            onRemove={setSelectedOption}
                            displayValue="location_name"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisibleedit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Viewmedicalplantype