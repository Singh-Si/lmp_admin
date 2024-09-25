import React, { useState, useEffect } from 'react';
import { CWidgetStatsC } from '@coreui/react';
import { CCol } from '@coreui/react';
import { Accordion } from 'react-bootstrap';
import PropTypes, { func } from 'prop-types';
import { useNavigate } from 'react-router-dom';
SalesDashboard.propTypes = {
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes.string

    })
};

SalesDashboard.propTypes = {
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
SalesDashboard.propTypes =
{
    updateSharedData: PropTypes.func.isRequired,
};
function SalesDashboard({ filterOptions, defaultOptions, updateSharedData }) {
    const navigate = useNavigate()
    const [agentData, setAgentData] = useState([])
    // const [a, setA] = useState(10)
    // const [b, setB] = useState(11)
    // const [c, setC] = useState(20)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            LeadsConbertedByAgent()
            // getpileads(page, perPage);
        }
    }, [filterOptions]);

    const LeadsConbertedByAgent = () => {
        let dateRange = filterOptions.dateRange;
        let startdate = defaultOptions.startdate;
        let enddate = defaultOptions.enddate;
        // let newlocation = filterOptions.location
        let newlob = filterOptions.lob
        let newagent = filterOptions.agent;
        // let newbusinessType = filterOptions.businessType
        const requestOptions =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                lob: newlob,
                dateRange: dateRange,
                startdate: startdate,
                enddate: enddate,
                newagent: newagent
            }),

        };
        fetch(`https://lmp.handsintechnology.in/api/getLeadsConvertedbyEachAgent`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let resdata = data.data
                console.log(resdata, ">>>>>>>>>>>>>>>>>fsdfsdfdf>>>>>>>>>>>>>>>> ressssssssssssponsee")
                setAgentData(resdata)
                // const total = data.count;
                // const slice = total / perPage;
                // const pages = Math.ceil(slice);
                // setPageCount(pages);
                // setPerIpCount(resdata)

            });
    }
    return (
        <div>

            <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <div style={{ position: 'relative' }} className="card-header new_leads">
                            <strong>Sales</strong>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                        <row className='d-flex'>
                            {/* <CCol md={4} style={{ height: '250px' }}>
                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"No of leads converted by each agent"}
                                    value={<span className='d-flex'><p>Allocated - </p><p style={{ color: 'red' }}> 10</p>
                                        <p className='mx-2'>Closed - </p><p style={{ color: 'green' }}> 5</p>
                                    </span>}
                                />
                            </CCol>
                            <CCol md={4} style={{ height: '250px' }}>
                                <CWidgetStatsC
                                    className="m-3 p-3"
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="Widget helper text"
                                    title={"No of leads lost by each agent"}
                                    value={<p style={{ color: 'red' }}>15</p>}
                                />
                            </CCol> */}
                            <table className="table table-bordered table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>Sr No.</th>
                                        <th>Agent</th>
                                        <th>Allocated</th>
                                        <th>Closed</th>
                                        <th>Lost</th>
                                        <th>Premium</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agentData?.map((item, index) => 
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.AllocatedLeads?.length}</td>
                                            <td>{item.leadsByStatus.Closed?.length}</td>
                                            <td>{item.leadsByStatus['Lost & Dropped?.length']?.length}</td>
                                            <td>{item.leadsByStatus.New?.length}</td>
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                        </row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}
export default SalesDashboard
