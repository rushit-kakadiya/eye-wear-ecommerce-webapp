import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import classnames from "classnames";


import { getNumberFormat } from '../../../utilities/methods';
import  Data from "./Data"
import { Row, Col } from 'reactstrap';

export default ({ performanceDetail, loading, tab }) => {
    let categories = performanceDetail.list && performanceDetail.list.map(a => a.created_at);
    let results = performanceDetail.list && performanceDetail.list.map(a => a.result);


    let formatPrefix = "-"

    if(tab=="htosales" || tab=="opticiansales" || tab=="staffsales"){
        formatPrefix = "IDR"
    }

    const data = {
        options: {
          chart: {
            id: 'sales'
          },
          xaxis: {
            categories: categories
          },
          tooltip: {
            y : {
              formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                return getNumberFormat(value,formatPrefix);
              },
            }
          },
          dataLabels: {
            formatter: function (val, opts) {
              return getNumberFormat(val,formatPrefix);
            }
          },
          colors : ['#5e72e4'],
        },
        series: [{
          name: '',
          data: results
        }],
      }
    

    return (
        <>
            <Row>
                <Col md="12" >
                  {loading ? 'loading...' :<>
                      <Data performanceDetail={performanceDetail} tab={tab} />
                      <Col md="12" className='padding-0'>
                        <Chart
                          options={data.options}
                          series={data.series}
                          type="area"
                          height="350"
                          
                          width={"100%"}
                        />
                      </Col>
                  </>}
                </Col>
            </Row>
        </>
    )
}