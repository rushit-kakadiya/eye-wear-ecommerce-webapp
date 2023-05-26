import React, { Component } from 'react';
import StepZilla from 'react-stepzilla';
import {
	Card,
	CardBody,
	CardTitle
} from 'reactstrap';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

class FormSteps extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.sampleStore = {
			email: '',
			gender: '',
			savedToCloud: false
		};
	}

	getStore() {
		return this.sampleStore;
	}

	updateStore(update) {
		this.sampleStore = {
			...this.sampleStore,
			...update,
		}
	}

	render() {
		const steps =
			[
				{ name: 'Welcome', component: <Step1 getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
				{ name: 'Personal Details', component: <Step2 getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
				{ name: 'Physical Details', component: <Step3 getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> },
				{ name: 'Done', component: <Step4 getStore={() => (this.getStore())} updateStore={(u) => { this.updateStore(u) }} /> }
			]

		return (
			<Card>
				<CardBody className="border-bottom">
					<CardTitle className="mb-0"><i className="mdi mdi-border-right mr-2"></i>Form Steps</CardTitle>
					<h6 className="card-subtitle mb-0 mt-1">Visit for more info https://www.npmjs.com/package/react-stepzilla</h6>
				</CardBody>
				<CardBody>
					<div className='example'>
						<div className='step-progress'>
							<StepZilla
								steps={steps}
								nextTextOnFinalActionStep={"Save"}
							/>
						</div>
					</div>
				</CardBody>
			</Card>

		)
	}
}

export default FormSteps;
