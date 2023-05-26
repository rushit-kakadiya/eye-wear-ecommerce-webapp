import React from 'react';
import Chart from "react-apexcharts";
import {
    Card,
    CardBody,
    CardTitle
  } from "reactstrap";
import { getNumberFormat } from "../../utilities/methods";

export default ({data = {}, loading}) => {
  const chartData = data.amount ? data.amount.reduce((acc, val, i) => {
    if(val > 0){
      acc.amount.push(val);
      acc.duration.push(data.duration[i]);
    }
    return acc;
  },{amount:[], duration:[]}) : {};

  const optionproducts = {
    chart: {
      id: "basic-bar",
      type: "line",
      toolbar: {
        show: false,
      },
      stacked: false,
    },
    labels: ["Day"],
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
    colors: ["#2962FF", "#4fc3f7"],
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
      name: "Sale Rp",
      type: "column",
      data: chartData.amount
    }
  ];

    return(
        <Card>
          <CardBody>
            <div className="d-md-flex align-items-center">
              <div>
                <CardTitle>SALES</CardTitle>
                {/* <CardSubtitle>Rp 20,0000</CardSubtitle> */}
              </div>
            </div>
            <div className="mt-4">
              {loading ? <h4>loading...</h4> :
                <Chart
                options={optionproducts}
                series={seriesproducts}
                type="line"
                height="350"
              />
              }
            </div>
          </CardBody>
        </Card>
    )
}