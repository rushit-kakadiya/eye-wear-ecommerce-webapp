import React, { Component } from 'react';

export default class Step3 extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="step step3 mt-5">
				<div className="row justify-content-md-center">
					<div className="col-lg-8">
						<form>
							<div className="form-group row">
								<label htmlFor="height" className="col-sm-2 col-form-label">Height</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Height (in cm)" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="weight" className="col-sm-2 col-form-label">Weight</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Weight (in kg)" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="chest" className="col-sm-2 col-form-label">Chest</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Chest (in inch)" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="waist" className="col-sm-2 col-form-label">Waist</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Waist (in inch)" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="arm" className="col-sm-2 col-form-label">Arm Length</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Arm Length (in cm)" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="vision" className="col-sm-2 col-form-label">Vision</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Vision (ie. 6/6, 6/9, 6/12)" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="vision" className="col-sm-2 col-form-label">Any Major Disease/Surgery in Past 10 Years?</label>
								<div className="col-sm-10">
									<div className="custom-control custom-radio">
										<input type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input" />
										<label className="custom-control-label" htmlFor="customRadioInline1">No</label>
									</div>
									<div className="custom-control custom-radio">
										<input type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" />
										<label className="custom-control-label" htmlFor="customRadioInline2">Only Surgery</label>
									</div>
									<div className="custom-control custom-radio">
										<input type="radio" id="customRadioInline3" name="customRadioInline1" className="custom-control-input" />
										<label className="custom-control-label" htmlFor="customRadioInline3">Only Disease</label>
									</div>
									<div className="custom-control custom-radio">
										<input type="radio" id="customRadioInline4" name="customRadioInline1" className="custom-control-input" />
										<label className="custom-control-label" htmlFor="customRadioInline4">Both</label>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
