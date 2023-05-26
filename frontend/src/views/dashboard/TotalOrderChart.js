import React from 'react';
import Chart from "react-apexcharts";
import {
    Card,
    CardBody,
    CardTitle
  } from "reactstrap";

export default ({data = {}, loading}) => {
  const chartData = data.totalOrders ? data.totalOrders.reduce((acc, val, i) => {
    if(val > 0){
      acc.totalOrders.push(val);
      acc.duration.push(data.duration[i]);
    }
    return acc;
  },{totalOrders:[], duration:[]}) : {};
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
      name: "Orders",
      type: "column",
      data: chartData.totalOrders
    }
  ];

    return(
        <Card>
          <CardBody>
            <div className="d-md-flex align-items-center">
              <div>
                <CardTitle>ORDERS</CardTitle>
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