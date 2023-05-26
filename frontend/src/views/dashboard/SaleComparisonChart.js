import React from "react";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import Chart from "react-apexcharts";
import { getNumberFormat } from "../../utilities/methods";

export default ({duration, data = {}, loading, dataComparizon = {}}) => {
    const chartData = data.amount ? data.amount.reduce((acc, val, i) => {
        if(val > 0  || dataComparizon.amount[i] >  0){
            acc.amount.push(val);
            acc.duration.push(duration === '30' ? `${dataComparizon.duration[i]}/${data.duration[i]}` : data.duration[i]);
            acc.saleComparizon.push(dataComparizon.amount[i]);
        }
        return acc;
    },{amount:[], duration:[], saleComparizon: []}) : {};

  const getDurationName = (type, text = 'Rp') => {
    if(duration === '0' || duration === '1'){
      return `${type === 'Last' ? 'Last Day' : 'Today'} Sale ${text}`;
    } else if (duration === '7'){
      return `${type} Week Sale ${text}`;
    } else if (duration === '30'){
      return `${type} Month Sale ${text}`;
    } else {
      return `${type} Year Sale ${text}`;
    }
  };

  const optionproducts = {
    chart: {
      id: "basic-bar",
      type: "line",
      toolbar: {
        show: false,
      },
      stacked: false,
    },
    labels: ["Day", "Month"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
      borderColor: "rgba(0,0,0,0.1)",
    },
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
      theme: "dark",
    },
    legend: {
      show: false,
    },
    colors: ["#4fc3f7", "#2962FF"],
    plotOptions: {
      bar: {
        columnWidth: "25%",
      },
    },
    fill: {
      opacity: 1,
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: chartData.duration,
      labels: {
        show: true,
        style: {
          colors: [
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
          ],
          fontSize: "12px",
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        formatter: function (value) {
          return getNumberFormat(value);
        },
        style: {
          colors: [
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
          ],
          fontSize: "12px",
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
  };
  const seriesproducts = [
    {
      name: getDurationName('Last'),
      type: "column",
      data: chartData.saleComparizon,
    },
    {
      name: getDurationName('This'),
      type: "column",
      data: chartData.amount,
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-3 [Ecommerce]                                                */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <div className="d-md-flex align-items-center">
          <div>
            <CardTitle>Sales Comparison</CardTitle>
            {/* <CardSubtitle>Total Earnings of the Month</CardSubtitle> */}
          </div>
        </div>
        <div className="product-sales">
        {loading ? <h4>loading...</h4> :
          <>
            <Chart
              options={optionproducts}
              series={seriesproducts}
              type="line"
              height="400"
            />
            <Row>
              <Col md="2" sm={{offset: 1}}>
                <span style={{
                  height: '15px',
                  width: '15px',
                  backgroundColor: '#4fc3f7',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span> {getDurationName('Last', '')}
              </Col>
              <Col md="3">
                <span style={{
                  height: '15px',
                  width: '15px',
                  backgroundColor: '#2962FF',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span> {getDurationName('This', '')}
              </Col>
            </Row>
            
          </>
        }
        </div>
      </CardBody>
    </Card>
  );
};

