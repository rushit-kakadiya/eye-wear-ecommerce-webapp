import React, {useState} from 'react';
import { Row, Col, Label, Button} from "reactstrap";
import {cancelHtoComment} from '../../utilities/constants';


export default ({setCancelComment, toggle, cancelComment, handleUpdate}) => {
    const [isOther, setIsOther] = useState(false); 

    return(
        <>
        <Row className="mt-2">
            <Col sm="2"></Col>
            <Col >
            { cancelHtoComment.map(row=>
            <Label className="ml-3">
                    <input
                    name="comment"
                    type="radio"
                    value={row}
                    onClick={(e)=>{setCancelComment(e.target.value); setIsOther(false);}}
            />{'  '}{row}</Label>)}
            </Col>
        </Row>
        <Row>
            <Col sm="2"></Col>
            <Col >
            <Label className="ml-3">
                <input
                name="comment"
                type="radio"
                value="other"
                onClick={()=>{setIsOther(!isOther)}}
            />{'  '}other</Label>
            </Col>
        </Row>
        {isOther &&
        <Row>
            <Col sm="2"></Col>
            <Col sm="8">
                <input
                    name="otherComment"
                    type="text"
                    placeholder="Type reason"
                    className="form-control"
                    onChange={(e)=>{setCancelComment(e.target.value)}}
                />
            </Col>
        </Row>}
        <Row className="m-4">
        <Col md="6">
            <Button style={{ width: '100%'}} className="btn" outline color="danger" type="button" onClick={()=>toggle('cancelHtoOppiontment')} >
                Cancel
            </Button>
        </Col>
        <Col md="6">
            <Button style={{width: '100%'}} color="primary" type="submit" onClick={()=>{toggle('cancelHtoOppiontment'); handleUpdate({appointment_status: "appointment_cancelled"})}} disabled={cancelComment === ""}>
                submit
            </Button>
        </Col> 
        </Row>
        </>
    )
}