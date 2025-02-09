import React from 'react';
import { useState, useEffect } from 'react';
import { Form, json, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const YearCode = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            locationList();
        }
    }, []);

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
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            const hasEmptyFields = rowsData.some((row) => {
                return !row.location;
            });

            if (hasEmptyFields) {
                // Display an error message or handle the validation error as needed
                swal({
                    title: "Warning!",
                    text: "Please fill in all fields for each row.",
                    type: "warning",
                    icon: "warning"
                });
                return false; // Exit the function if there are empty fields
            }
            else {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rowsData)
                };
                fetch(`https://lmp.handsintechnology.in/api/addYatchYear`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 201) {
                            swal({
                                text: data.message,
                                type: "success",
                                icon: "success",
                                button: false
                            })
                            setTimeout(() => {
                                swal.close()
                                navigate('/ViewYachtYearCode')
                            }, 1000);

                        }
                        else if (data.status != 200) {
                            swal({
                                title: "Error!",
                                text: data.message,
                                type: "error",
                                icon: "error",
                                button: false
                            })
                            setTimeout(() => {
                                swal.close()
                                navigate('/ViewYachtYearCode')
                            }, 1000);
                        }
                    });

            }
        }
        catch (err) {
            console.log(err)
        }

    }
    const addTableRows = () => {
        const rowsInput =
        {
            yearDesc: '',
            location: location,

        }
        setRowsData([...rowsData, rowsInput])
    }
    const deleteTableRows = (index) => {
        const rows = [...rowsData]
        rows.splice(index, 1)
        setRowsData(rows)
    }
    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target

        if (value.trim() === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'This is required',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '', // Clear the error message if the value is not empty
            }));
        }
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }
    const handleChange1 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }
    const handleImageChange = (indx, file) => {
        //  file["logoindex"] = indx
        rowsData[indx]["logo"] = file;
        // const AllLogos = [...logos]
        // AllLogos.push(file)
        // setLogos(AllLogos)
    }
    return (
        <div className="container">
            <div className="row" >
                <div className="col-md-12" >
                    <div className="card" >
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4 className="card-title">Add Yacht Year Code</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered" style={{ width: "auto" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th>Year Code</th>
                                        <th>Location</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rowsData.map((data, index) => {
                                            return (
                                                <tr key={index} >
                                                    <td>
                                                        <button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button>
                                                    </td>
                                                    <td>
                                                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="yearDesc" placeholder="Year Code" autoComplete="off" required />

                                                    </td>
                                                    <td>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                            onRemove={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                            placeholder="Select Location"
                                                            showCheckbox={true}
                                                            closeOnSelect={false}
                                                            required
                                                        />
                                                    </td>


                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-outline-success" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YearCode
