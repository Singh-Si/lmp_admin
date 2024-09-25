import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import filePath from '../../../../webroot/sample-files/Additional_Underwritiong_condition_sample.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const StandardUnderwrinting = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            geTableBenefits(page, perPage);
            exportlistdata();
        }
    }, []);

    const [excelfile, setExcelfile] = useState("");
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [standardConditions, setStandardConditions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editshowModal, setEditShowModal] = useState(false);
    const [additionalConditionId, setAdditionalConditionId] = useState('');
    const [standardConditionValues, setStandardConditionValues] = useState({});

    const geTableBenefits = async (page, perPage) => {
        setStandardConditions([]);
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://lmp.handsintechnology.in/api/get_additional_Underwriting_condition?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setStandardConditions(data.data);
            });
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        geTableBenefits(selectedPage + 1, perPage);
    };

    const updatestatus = async (id, status) => {
        let result = await fetch('https://lmp.handsintechnology.in/api/update_additional_condition_status', {
            method: 'post',
            body: JSON.stringify({ id, status }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        swal("Updated Succesfully", "", "success");
        geTableBenefits(page, perPage)
    }

    const AdditionalUnderwritingCondition = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const additional_label = formData.get('additional_label');
        const description = formData.get('description');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ additional_label, description }),
        };
        fetch(`https://lmp.handsintechnology.in/api/add_Additional_Underwriting_condition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setShowModal(false);
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false,
                    })
                    geTableBenefits(page, perPage);
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
                    geTableBenefits(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const additional_label = formData.get('additional_label');
        const description = formData.get('description');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ additional_label, description, additionalConditionId }),

        };
        fetch(`https://lmp.handsintechnology.in/api/update_Additional_Underwriting_condition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setEditShowModal(false);
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    geTableBenefits(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    setEditShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    geTableBenefits(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
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
        fetch('https://lmp.handsintechnology.in/api/get_additional_Underwriting_condition', requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }
    const fileType = 'xlsx'
    const exporttocsv = () => {
        const updatedData = exportlist.map((item, index) => {
            return {

                'Feature': item.feature,
                'Description': item.description,
            }
        })
        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Additional-underwriting-conditions" + ".xlsx")
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://lmp.handsintechnology.in/api/read_additional_condition_status_excel",
            {
                method: "POST",
                body: fd,
            });
        result = await result.json();
        if (result.status == 200) {
            setVisible(!visible)
            swal({
                text: result.message,
                type: "success",
                icon: "success",
                button: false,
            })
            geTableBenefits(page, perPage)

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
            geTableBenefits(page, perPage)

            setTimeout(() => {
                swal.close()
            }, 1000);
        }
    }

    const detailsbyid = async (ParamValue) => {
        setAdditionalConditionId(ParamValue)
        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://lmp.handsintechnology.in/api/get_additional_Underwriting_conditionbyid`, requestOptions);
        result = await result.json();
        setStandardConditionValues(result.data);


        setEditShowModal(true);
    };
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/deleteMedicalMaster/?id=${id}&type=additionalConditions`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    geTableBenefits(page, perPage);
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
                    geTableBenefits(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const AddAdditionalCondition = () => {
        navigate("/AddAdditionalConditions")
    }
    const startFrom = (page - 1) * perPage;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Co-Payment</h4>
                                </div>
                                <div className="col-md-6">
                                    <button className='btn btn-primary' style={{ float: "right" }} onClick={() => AddAdditionalCondition()}>Add Co-Payment</button>
                                </div>
                            </div>
                        </div>
                        {/* <div className="card-header" style={{ textAlign: 'right' }}>
                            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                        </div> */}
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Feature</strong></th>
                                        <th><strong>Description</strong></th>
                                        <th><strong>Action</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standardConditions.length > 0 ?
                                        standardConditions.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.feature}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>&nbsp;&nbsp;
                                                    {
                                                        item.status === 1 ?
                                                            <button className="btn btn-danger mr-5" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                            <button className="btn btn-success mr-5" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                    }
                                                    <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                    <button className="btn btn-info mx-1" onClick={() => navigate(`/ViewCopayment?id=${item._id}`)}>Co-Payment</button>
                                                </td>
                                            </tr>
                                        ) : <tr>
                                            <td colSpan="4">No Data Found</td>
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
                </div>
            </div>

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" onChange={(e) => setExcelfile(e.target.files[0])} required />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Co-Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={AdditionalUnderwritingCondition}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Co-Payment</strong></label>
                                                        <input type='text' className="form-control" name='additional_label' placeholder="Enter Co-Payment Feature" autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Co-Payment Description</strong></label>
                                                        <input type='text' className="form-control" name='description' placeholder="Enter Co-Payment Description" autoComplete='off' required />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Submit</button>
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

            <Modal size='lg' show={editshowModal} onHide={() => setEditShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Table Benefit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Co-Payment</strong></label>
                                                        <input type='text' className="form-control" name='additional_label' placeholder='Enter Condition Label' defaultValue={standardConditionValues.feature} autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Additiona Conditions Description</strong></label>
                                                        <input type='text' className="form-control" name='description' placeholder='Enter Condition Description' defaultValue={standardConditionValues.description} autoComplete='off' required />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Update</button>
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
                    <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default StandardUnderwrinting
