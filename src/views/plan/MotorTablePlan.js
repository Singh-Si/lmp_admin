import React from "react";
import { useEffect, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";

function TablePlan({ rowsData, deleteTableRows, handleChange, handleChange123, errors }) {
    const [planCategory, setPlanCategory] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [bodyType, setBodyType] = useState([]);
    const [repairCondition, setRepairCondition] = useState([]);
    const [planFor, setPlanFor] = useState([]);
    const [businessType, setBusinessType] = useState([]);
    const [gccspecs, setGccSpecs] = useState([]);
    const [nationality, setNationality] = useState([]);
    const [modelmotor, setModelMotor] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [policyTypes, setPolicyTypes] = useState([]);
    const [cylinder, setCylinder] = useState();
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
        index: ''
    })


    useEffect(() => {
        company_list();
        Plancategory();
        NatureOfPlan();
        BodyType();
        repair_condition();
        plan_for();
        business_type();
        gcc_specs();
        nationality_list();
        model_motor();
        policy_types();
        locationList();
        const cylinder_list = [
            { id: 2, name: '2' },
            { id: 4, name: '4' },
            { id: 6, name: '6' },
            { id: 8, name: '8' },
            { id: 10, name: '10' },
            { id: 12, name: '12' },
        ];
        setCylinder(cylinder_list);
        console.log(errors, 'errors')
    }, []);

    const policy_types = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getPolicyTypes`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPolicyTypes(data.data);
            });
    }

    const Plancategory = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getPlanCategory`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanCategory(data.data);
            });
    }

    const NatureOfPlan = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getNatureOfPlan`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNatureOfPlan(data.data);
            });
    }

    const BodyType = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getBodyType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setBodyType(data.data);
                console.log(data.data)
            });
    }

    const repair_condition = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getRepairCondition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setRepairCondition(data.data);
            });
    }

    const plan_for = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getPlanFor`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanFor(data.data);
            });
    }

    const business_type = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getBusinessType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const selectedOption = data.data;
                const business_type_dt = selectedOption?.length;
                const business_type_obj = [];
                for (let i = 0; i < business_type_dt; i++) {
                    const business_type_obj1 = {
                        _id: selectedOption[i]['_id'],
                        business_type_name: selectedOption[i]['business_type_name']
                    };
                    business_type_obj.push(business_type_obj1);
                }
                var business_typeValues = business_type_obj;
                setBusinessType(business_typeValues);
            });
    }

    const gcc_specs = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getGccSpecs`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setGccSpecs(data.data);
            });
    }

    const nationality_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getNationality`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNationality(data.data);
            });
    }

    const model_motor = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/getModelMotor`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setModelMotor(data.data);
            });
    }

    const company_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://lmp.handsintechnology.in/api/company_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCompanyList(data.data);
            });
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
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
            });
    }
    const handleChange1 = (index, evnt, title) => {
        handleChange123(index, evnt, title);
    };
    // const handleSelectChange = (index, evnt, title) => {
    //     handleChange123(index, evnt, title);
    // };
    const validateInput = (e, index) => {
        const inputValue = e.target.value;
        const textPattern = /^[A-Za-z,]*$/;
        if (!textPattern.test(inputValue)) {
            setErrmsg({ status: true, name: e.target.name, index: index })
            e.target.value = inputValue.replace(/[^a-zA-Z\s,]/g, '');
        } else {
            setErrmsg({ status: false, name: e.target.name, index: index })
        }
    }
    return (
        rowsData.map((data, index) => {
            return (
                <tr key={index}>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button>
                    </td>
                    <td>
                        <select className="form-control" name="company_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Company</option>
                            {companyList.map((item, index) => (
                                <option key={index} value={item._id}>{item.company_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="plan_name" className="form-control" placeholder="Enter Plan Name" />
                        {/* {errors.plan_name && <span className="error">{errors.plan_name}</span>} */}
                    </td>
                    <td>
                        <select className="form-control" name="plan_category_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Plan Category</option>
                            {planCategory.map((item, index) => (
                                <option key={index} value={item._id}>{item.plan_category_name}</option>
                            ))}
                        </select>
                        {/* {errors.plan_category_id && <span className="error">{errors.plan_category_id}</span>} */}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="plan_label" className="form-control" placeholder="Enter Plan Label" />
                    </td>
                    <td>
                        <select className="form-control" name="nature_of_plan_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Nature Of Plan</option>
                            {natureOfPlan.map((item, index) => (
                                <option key={index} value={item._id}>{item.nature_of_plan_name}</option>
                            ))}
                        </select>
                    </td>

                    <td>
                        <Multiselect
                            className="form-control"
                            options={bodyType}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'body_type_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'body_type_name'))}
                            displayValue="body_type_name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>
                    {rowsData[0]?.policy_type == 'Comprehensive' ? ("") : (<td>
                        <Multiselect
                            className="form-control"
                            options={cylinder}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'cylinder'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'cylinder'))}
                            displayValue="name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>)}
                    <td>
                        <Multiselect
                            className="form-control"
                            options={repairCondition}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'repair_condition_id'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'repair_condition_id'))}
                            displayValue="repair_type_name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>
                    <td>
                        <select className="form-control" name="electric_vehicle" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="0" hidden>Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>

                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={planFor}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'plan_for'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'plan_for'))}
                            displayValue="plan_for_name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="plan_for_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Plan For)" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={businessType}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'business_type_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'business_type_name'))}
                            displayValue="business_type_name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="car_value" className="form-control" placeholder="One or more ranges e.g. 0-50000,50001-10000" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="excess" className="form-control" defaultValue={data.excess} placeholder="One or more ranges based on the vehicle value e.g. 250,350,500" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="car_value_topup" className="form-control" placeholder="Enter Car Value Fixed/Percentage/Reffered" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="rate" className="form-control" placeholder="One or more ranges e.g. 1.2%,2.5%" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="min_premium" className="form-control" placeholder="Enter Min Premium" />
                    </td>

                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="age" className="form-control" placeholder="One or more ranges e.g. 21-24,25-60,60-70 years" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="agetopup" className="form-control" placeholder="Enter Age Fixed/Percentage/Reffered" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="drivingexp" className="form-control" placeholder="One or more ranges e.g. 0-11,12-6000 months" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="drivingexptopup" className="form-control" placeholder="Enter Driving Experience Fixed/Percentage/Reffered" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="homedrivingexp" className="form-control" placeholder="One or more ranges e.g. 0-11,12-6000 months" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="homedrivingexptopup" className="form-control" placeholder="Enter Home Country Driving Experience Fixed/Percentage/Reffered" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="claimyears" className="form-control" placeholder="One or more ranges e.g. 1,2,3,4,5 years" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="claimyeardisc" className="form-control" placeholder="One or more ranges e.g. 0-2,0-5,0-10 years from the date of first registration" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={policyTypes}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'policy_type_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'policy_type_name'))}
                            displayValue="policy_type_name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="last_year_policy_type_topup" className="form-control" placeholder="Enter Last Year Policy Type Fixed/Percentage/Reffered" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={gccspecs}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'gcc_spec'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'gcc_spec'))}
                            displayValue="plan_for_gcc_spec_name"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="gccspecstopup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (GCC / No-GCC)" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={nationality}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'nationality'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'nationality'))}
                            displayValue="nationality_name"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="NationalTopup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Nationality)" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={modelmotor}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'make_motor'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'make_motor'))}
                            displayValue="make_motor_name"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="car_model_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Car Model Topup)" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="age_of_the_car" className="form-control" placeholder="One or more ranges e.g. 0-2,0-5,0-10 years from the date of first registration" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="age_of_the_car_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Age Of The Car)" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc" onInput={(e) => validateInput(e, index)} className="form-control" placeholder="One or more ranges e.g. Policy fee,EVG charges" />
                        {errmsg.status == true && errmsg.name == "add_op_con_desc" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Add Option Condition Description)" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="vat" onInput={(e) => validateInput(e, index)} className="form-control" placeholder="Enter Vat Able" />
                        {errmsg.status == true && errmsg.name == "vat" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="jdv_comm" className="form-control" placeholder="Enter JDV Commission" />
                    </td>
                    <td>
                        <Multiselect
                            options={location}
                            selectedValues={location}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'location'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'location'))}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                        />
                    </td>
                </tr>
            )
        })
    )
}

export default TablePlan;