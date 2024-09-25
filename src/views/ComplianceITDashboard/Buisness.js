import React, { useEffect } from 'react';
import { CWidgetStatsC } from '@coreui/react';
import { CCol } from '@coreui/react';
import { Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

BussinessDashboard.propTypes = {
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes.string
    })
};

BussinessDashboard.propTypes = {
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.string,
        defaultlob: PropTypes.string,
        defaultbusinessType: PropTypes.string,
        defaultagent: PropTypes.string,
        defaultdateRange: PropTypes.string,
        startdate: PropTypes,
        enddate: PropTypes,
    })
};

BussinessDashboard.propTypes =
{
    updateSharedData: PropTypes.func.isRequired,
};
function BussinessDashboard({ filterOptions, defaultOptions, updateSharedData }) {
    const navigate = useNavigate()
    // const [a, setA] = useState(10)
    // const [b, setB] = useState(11)
    // const [c, setC] = useState(20)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            // getpileads(page, perPage);
        }
    }, [filterOptions]);

    return (
        <div>
            <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey='0'>
                    <Accordion.Header>
                        <div style={{ position: 'relative' }}
                            className='card-header new_leads'>
                            <strong>Bussiness</strong>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                        <row className='d-flex'>
                            <CCol md={4} style={{ height: '250px' }}>
                                <CWidgetStatsC
                                    className='m-3 p-3'
                                    style={{ fontSize: '16px', fontWeight: '600' }}
                                    progress={{ color: 'primary', value: 100 }}
                                    text="widget helper text"
                                    title={'Pending leads'}
                                />
                            </CCol>
                        </row>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default BussinessDashboard;
