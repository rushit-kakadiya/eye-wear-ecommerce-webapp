import React from "react";
import { Card, CardBody, Row, Col, FormGroup, Button } from "reactstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import BackButton from '../../views/buttons/BackButton';
import MultiSelect from  'react-multiple-select-dropdown-lite';
import  'react-multiple-select-dropdown-lite/dist/index.css';
import {monthDiff, getFormatDate} from '../../utilities/methods';

//BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const localizer = momentLocalizer(moment);  


export default ({opticianList, events, setSelectedOptician, alertselectedEvent, history, clearHtoInformation, setMonth, type, setType}) => {
const eventsData = type === 'month' ? events.map(row=>({...row, title:`${row.slot_start_time} - ${row.title}`, name: row.title})) : events.map(row=>({...row, start:getFormatDate(row.start), end: getFormatDate(row.end)}));

  return (
    <div>
      <Row> 
        <Col md="5">
            <h6> <BackButton path="/hto/inside-area" history={history}/> Optician Calender</h6> 
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xs={12} md={12} className="ml-auto mr-auto">
          <Card className="card-calendar">
            <CardBody>
      <Row>
        <Col sm="5">
        <MultiSelect
        onChange={val=> val === "" ? setSelectedOptician() : setSelectedOptician(val.split(","))}
        options={opticianList.map(row=>({label:row.name, value:row.id}))}
        style={{width:"100%"}}
        placeholder="Select Optician"
      />
      </Col>
      <Col md="7" className="text-right">
            <FormGroup>
              <Button type="button" color="primary" id={`Popover-1`} onClick={()  =>  {
                  clearHtoInformation();
                  history.push('/hto/add');
                }
              }>Add HTO Appointment</Button>
            </FormGroup>
        </Col>
      </Row>
            <div className="mt-2">
              <Calendar
                selectable
                events={eventsData}
                defaultView="month"
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date()}
                localizer={localizer}                
                views={['month', 'week']}
                onSelectEvent={(event) => alertselectedEvent(event)}
                onNavigate={(navigate)=>setMonth(monthDiff(navigate))}
                onView={(view)=>setType(view)}
                popup
              />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
