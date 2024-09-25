import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import headersData from '../../../../utils/averagerateheaders.json';

function Tablehaders({ lobname }) {
    const headers = headersData[lobname] || headersData["all"];
    return (
        <tr className="table-info">
            {headers.map((header) => (
                <th key={header.label} scope="col">{header.label}</th>
            ))}
        </tr>
    );
}

function MotorDataRow({ item }) {
    if (item.length === 0) {
        return (
            <tr>
                <td colSpan="4">No records found</td>
            </tr>
        );
    }

    return item.flatMap((val, i) => {
        const comprehensivePlans = val?.comprehensive_plans || [];
        const tplPlans = val?.tpl_plans || [];

        // Combine both comprehensive and tpl plans
        const allPlans = [...comprehensivePlans, ...tplPlans];

        return allPlans.map((plan, index) => {
            const planType = comprehensivePlans.includes(plan) ? "Comprehensive" : "TPL";
            const planName = plan.plan_name || "N/A";

            // Calculate rates and total average
            let rates = 0;
            const leadsCount = plan.leads?.length || 1;
            const rateData = planType === "Comprehensive" ? plan.rate : plan.body_type;

            rates = rateData?.reduce((ac, current) => {
                const value = planType === "Comprehensive" ? current.rate : current.premium;

                if (typeof value === 'number') return ac + value;
                if (typeof value === 'string' && !isNaN(value) && !value.includes("%")) return ac + parseFloat(value);

                return ac;
            }, 0) || 0;

            const totalAverage = (rates / leadsCount).toFixed(2);

            return (
                <tr key={`${i}-${index}`}>
                    {/* Display company name only once per company */}
                    {index === 0 && (
                        <>
                            <td rowSpan={allPlans.length}>{i + 1}</td>
                            <td rowSpan={allPlans.length}>{val.company_name || " "}</td>
                        </>
                    )}
                    <td>{planType}</td>
                    <td>{planName}</td>
                    <td>{plan?.body_type?.map(b => <div key={b?.body_type_name}>{b?.body_type_name}</div>)}</td>
                    <td>
                        {planType === "Comprehensive"
                            ? plan?.rate?.map((item, idx) => (
                                <div key={idx}>
                                    {item.car_valueMin} - {item.car_valueMax} : {item.rate}
                                </div>
                            ))
                            : plan?.body_type?.map((b, idx) => (
                                <div key={idx}>
                                    {b?.cylinder} ,{b?.premium} AED
                                </div>
                            ))
                        }
                    </td>
                    <td>{totalAverage}</td>
                </tr>
            );
        });
    });
}


function YachtDataRow({ item }) {
    if (item.length === 0) {
        return (
            <tr>
                <td colSpan="4">No records found</td>
            </tr>
        );
    }

    return item.flatMap((val, i) => {
        const comprehensivePlans = val?.comprehensive_plans || [];
        const tplPlans = val?.tpl_plans || [];

        // Combine both comprehensive and tpl plans
        const allPlans = [...comprehensivePlans, ...tplPlans];

        return allPlans.map((plan, index) => {
            const planType = comprehensivePlans.includes(plan) ? "Comprehensive" : "TPL";
            const planName = plan.plan_name || "N/A";

            // Calculate rates and total average
            let rates = 0;
            const leadsCount = plan.leads?.length || 1;
            const rateData = planType === "Comprehensive" ? plan.rate : plan.yacht_body_type_or_topup;

            rates = rateData?.reduce((ac, current) => {
                console.log("current???", planType === "Comprehensive" ? "Comprehensive" : "Tpl", current)
                const value = planType === "Comprehensive" ? current : current.primium;

                if (typeof value === 'number') return ac + value;
                if (typeof value === 'string' && !isNaN(value) && !value.includes("%")) return ac + parseFloat(value);

                return ac;
            }, 0) || 0;

            const totalAverage = (rates / leadsCount).toFixed(2);

            return (
                <tr key={`${i}-${index}`}>
                    {/* Display company name only once per company */}
                    {index === 0 && (
                        <>
                            <td rowSpan={allPlans.length}>{i + 1}</td>
                            <td rowSpan={allPlans.length}>{val.company_name || " "}</td>
                        </>
                    )}
                    <td>{planType}</td>
                    <td>{planName}</td>
                    <td>{plan?.business_type?.map(b => <div key={b?.business_type_name}>{b?.business_type_name}</div>)}</td>
                    <td>
                        {planType === "Comprehensive"
                            ? plan?.rate?.map((item, idx) => (
                                <div key={idx}>
                                    {typeof item == "string" && item.includes("%") ? item : item + " AED"}
                                </div>
                            ))
                            : plan?.yacht_body_type_or_topup?.map((b, idx) => (
                                <div key={idx}>
                                    {b?.measurement_value_min} - {b?.measurement_value_max} {b?.primium} AED
                                </div>
                            ))
                        }
                    </td>
                    <td>{totalAverage}</td>
                </tr>
            );
        });
    });
}

function TravelDataRow({ item }) {
    return item?.map((company, companyIndex) => (
        company?.plans?.map((plan, planIndex) => (
            plan?.travel_plan_prices?.map((price, priceIndex) => (
                price?.no_of_days_or_topup?.map((dayRange, dayRangeIndex) => {
                    // Ensure that each array is defined before calculating the rowSpan
                    const showCompanyName = planIndex === 0 && priceIndex === 0 && dayRangeIndex === 0;
                    const showPlanName = priceIndex === 0 && dayRangeIndex === 0;
                    const showCoverType = dayRangeIndex === 0;

                    const companyRowSpan = company?.plans?.reduce((total, plan) =>
                        total + (plan?.travel_plan_prices?.reduce((totalPrices, price) =>
                            totalPrices + (price?.no_of_days_or_topup?.length || 0), 0) || 0), 0) || 1;

                    const planRowSpan = plan?.travel_plan_prices?.reduce((totalPrices, price) =>
                        totalPrices + (price?.no_of_days_or_topup?.length || 0), 0) || 1;

                    const priceRowSpan = price?.no_of_days_or_topup?.length || 1;

                    return (
                        <tr key={`${companyIndex}-${planIndex}-${priceIndex}-${dayRangeIndex}`}>
                            {showCompanyName && (
                                <td rowSpan={companyRowSpan}>{companyIndex + 1}</td>
                            )}
                            {showCompanyName && (
                                <td rowSpan={companyRowSpan}>{company?.company_name ?? ' '}</td>
                            )}
                            {showPlanName && (
                                <td rowSpan={planRowSpan}>{plan?.plan_name ?? ' '}</td>
                            )}
                            {showCoverType && (
                                <td rowSpan={priceRowSpan}>{price?.cover_type_id?.travel_cover_type ?? ' '}</td>
                            )}
                            <td>{dayRange?.number_of_daysMin ?? ' '} - {dayRange?.number_of_daysMax ?? ' '}</td>
                            <td>{dayRange?.travel_premium ?? ' '}</td>
                        </tr>
                    );
                })
            ))
        ))
    )) ?? (
            <tr>
                <td colSpan="6">No Data Available</td>
            </tr>
        );
}
function HomeDataRow({ item }) {
    if (item.length > 0) {
        return item.map((val, i) => {
            const planNames = val?.plans?.map(c => c.plan_name) || [];
            const propertyTypes = val?.plans?.flatMap(c => c?.property_type_id?.map(b => b?.label)) || [];
            const buildingValues = val?.plans?.flatMap(c => c?.building_value_or_topup?.map(b => b.rate)) || [];
            const Leads = buildingValues.flatMap(c => c?.leads) || [];
            const filtercomprehensiveRates = buildingValues.filter((item) => {
                if (!item.includes("%")) {
                    item = +item
                    return item
                } else {
                    return false
                }
            })

            const AverageRate = filtercomprehensiveRates.reduce((a, b) => {
                return a + b
            }, 0) / (Leads.length || 1);
            const maxLength = Math.max(planNames.length, propertyTypes.length, buildingValues.length);

            return Array.from({ length: maxLength }).map((_, rowIndex) => (
                <tr key={`${i}-${rowIndex}`}>
                    {rowIndex === 0 && (
                        <>
                            <td rowSpan={maxLength}>{i + 1}</td>
                            <td rowSpan={maxLength}>{val.company_name || " "}</td>
                        </>
                    )}
                    <td>{planNames[rowIndex] || " "}</td>
                    <td >{propertyTypes[rowIndex] || " "}</td>
                    <td>{buildingValues[rowIndex] || " "}</td>
                    <td>{AverageRate || " "}</td>
                </tr>
            ));
        });
    } else {
        return (
            <tr>
                <td colSpan="8">No records found</td>
            </tr>
        );
    }
}
function MedicalDataRow({ item }) {
    if (item.length > 0) {
        return item.map((val, i) => {
            // Extracting plan details
            const planNames = val?.plans?.map(plan => plan.plan_name) || [];
            const rates = val?.plans?.flatMap(plan => plan.rates.map(rate => ({
                // rateName: rate.name,
                // TPA: rate.TPA || " ",
                // network: rate.network || " ",
                // coPayments: rate.primiumArray?.map(p => p.coPayments).join(', ') || " ",
                malePremium: rate.primiumArray?.map(p => p.malePre).join(', ') || " ",
                femalePremium: rate.primiumArray?.map(p => p.femalePer).join(', ') || " ",
                marriedFemalePremium: rate.primiumArray?.map(p => p.marrideFemalePre).join(', ') || " ",
            }))) || [];

            const maxLength = Math.max(planNames.length, rates.length);

            return Array.from({ length: maxLength }).map((_, rowIndex) => (
                <tr key={`${i}-${rowIndex}`}>
                    {rowIndex === 0 && (
                        <>
                            <td rowSpan={maxLength}>{i + 1}</td>
                            <td rowSpan={maxLength}>{val.company_name || " "}</td>
                        </>
                    )}
                    <td>{planNames[rowIndex] || ""}</td>
                    {/* <td>{rates[rowIndex]?.rateName || ""}</td>
                    <td>{rates[rowIndex]?.TPA || ""}</td>
                    <td>{rates[rowIndex]?.network || ""}</td>
                    <td>{rates[rowIndex]?.coPayments || ""}</td> */}
                    <td>{rates[rowIndex]?.malePremium || ""}</td>
                    <td>{rates[rowIndex]?.femalePremium || ""}</td>
                    <td>{rates[rowIndex]?.marriedFemalePremium || ""}</td>
                </tr>
            ));
        });
    } else {
        return (
            <tr>
                <td colSpan="9">No records found</td>
            </tr>
        );
    }
}
function HighestRateModal({ item, lobname }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const fullsreenlob = ["motor", "yacht"]
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                View Details
            </Button>
            <Modal show={show}
                onHide={() => setShow(false)}
                size='xl'
                fullscreen={
                    fullsreenlob.includes(lobname)
                }
                centered>
                <Modal.Header closeButton>
                    <Modal.Title className='text-capitalize'><strong>Line Of Buiness</strong>: {lobname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {item && Array.isArray(item) && item.length > 0 && lobname !== "all" ? (
                        lobname === "motor" ? (
                            <HighestRateModalBody element={<MotorDataRow item={item} />} lobname={lobname} />

                        ) : lobname === "yacht" ? (
                            <HighestRateModalBody element={<YachtDataRow item={item} />} lobname={lobname} />

                        ) : lobname === "travel" ? (
                            <HighestRateModalBody element={<TravelDataRow item={item} />} lobname={lobname} />

                        ) : lobname === "home" ? (
                            <HighestRateModalBody element={<HomeDataRow item={item} />} lobname={lobname} />

                        ) : lobname === "medical" ? (
                            <HighestRateModalBody element={<MedicalDataRow item={item} />} lobname={lobname} />

                        ) : (
                            ""
                        )
                    ) : (
                        "No content provided"
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <div className='text-center'>

                        <Button variant="primary " onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
function HighestRateModalBody({ element, lobname }) {
    return (
        <table className="table table-bordered table-responsive">
            <thead className="thead-dark">
                <Tablehaders lobname={lobname} />
            </thead>
            <tbody>
                {element || "No Modal"}
            </tbody>
        </table>
    )
}

function AllDataRow({ data }) {
    if (data && Object.keys(data).length > 0) {
        return Object.keys(data).map((val, i) => (
            <tr key={i}>
                <td>{i + 1}</td>
                <td className='text-capitalize'>{val}
                </td>
                <td className='text-capitalize'>
                    <HighestRateModal item={data[val]} lobname={val} />
                </td>
            </tr>
        ));
    } else {
        return (
            <tr>
                <td colSpan="2">No records found</td>
            </tr>
        );
    }
}

export function RenderHighestRateRows({ item, lobname, data }) {

    if (item && Array.isArray(item) && item.length > 0 && lobname !== "all") {
        if (lobname == "motor") {
            return <MotorDataRow item={item} />
        } else if (lobname == "yacht") {
            return <YachtDataRow item={item} />
        }
        else if (lobname == "travel") {
            return <TravelDataRow item={item} />
        }
        else if (lobname == "home") {
            return <HomeDataRow item={item} />
        }
        else if (lobname == "medical") {
            return <MedicalDataRow item={item} />
        }
    } else
        if (lobname == "all") {
            return <AllDataRow data={data} />
        }

};
function AllRowsAndTable({ data }) {
    if (data && Object.keys(data).length > 0) {
        return Object.keys(data).map((lobname, i) => {
            const item = data[lobname];
            if (item && Array.isArray(item) && item.length > 0) {
                switch (lobname) {
                    case "motor":
                        return <HighestRateModalBody element={<MotorDataRow key={i} item={item} />} lobname={lobname} />
                    case "yacht":
                        return <HighestRateModalBody element={<YachtDataRow key={i} item={item} />} lobname={lobname} />
                        return <YachtDataRow key={i} item={item} />;
                    case "travel":
                        return <HighestRateModalBody element={<TravelDataRow key={i} item={item} />} lobname={lobname} />
                        return <TravelDataRow key={i} item={item} />;
                    case "home":
                        return <HighestRateModalBody element={<HomeDataRow key={i} item={item} />} lobname={lobname} />
                        return <HomeDataRow key={i} item={item} />;
                    case "medical":
                        return <HighestRateModalBody element={<MedicalDataRow key={i} item={item} />} lobname={lobname} />
                        return <MedicalDataRow key={i} item={item} />;
                    default:
                        return null;
                }
            }
            return null;
        });
    } else {
        return <tr><td colSpan="100%">No records found</td></tr>;
    }
}

const sharedPropTypes = {
    item: PropTypes.array,
    lobname: PropTypes.string
};
const RenderHighestRateRowspropTypes = {
    item: PropTypes.array,
    lobname: PropTypes.string,
    data: PropTypes.array || PropTypes.object
};
RenderHighestRateRows.propTypes = RenderHighestRateRowspropTypes
Tablehaders.propTypes = { lobname: PropTypes.string };
MotorDataRow.propTypes = sharedPropTypes;
YachtDataRow.propTypes = sharedPropTypes;
TravelDataRow.propTypes = sharedPropTypes;
HomeDataRow.propTypes = sharedPropTypes;
MedicalDataRow.propTypes = sharedPropTypes;
HighestRateModal.propTypes = sharedPropTypes
AllDataRow.propTypes = { data: PropTypes.object }
HighestRateModalBody.propTypes = { element: PropTypes.object, lobname: PropTypes.string }
AllRowsAndTable.propTypes = {
    data: PropTypes.object.isRequired
};
export { Tablehaders, AllRowsAndTable, AllDataRow }

