import React, { Component } from 'react';

export default class Step2 extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="step step2 mt-5">
				<div className="row justify-content-md-center">
					<div className="col-lg-8">
						<form>
							<div className="form-group row">
								<label htmlFor="staticEmail" className="col-sm-2 col-form-label">Date of Birth</label>
								<div className="col-sm-2">
									<select className="custom-select">
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
									</select>
								</div>
								<div className="col-sm-4">
									<select className="custom-select">
										<option value="Jan">January</option>
										<option value="Feb">February</option>
										<option value="Mar">March</option>
									</select>
								</div>
								<div className="col-sm-4">
									<input type="text" className="form-control" placeholder="Year" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="inputPassword" className="col-sm-2 col-form-label">Home Address</label>
								<div className="col-sm-10">
									<div className="row mb-3">
										<div className="col-sm-12">
											<input type="text" className="form-control" placeholder="Street Address" />
										</div>
									</div>
									<div className="row">
										<div className="col-sm-5">
											<input type="text" className="form-control" placeholder="Suburb" />
										</div>
										<div className="col-sm-3">
											<select className="custom-select">
												<option value="nsw">NSW</option>
												<option value="hfk">HFK</option>
												<option value="uyr">UYR</option>
											</select>
										</div>
										<div className="col-sm-4">
											<input type="text" className="form-control" placeholder="Postcode" />
										</div>
									</div>
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="gender" className="col-sm-2 col-form-label">Gender</label>
								<div className="col-sm-10">
									<select className="custom-select">
										<option>Select Gender</option>
										<option value="1">Male</option>
										<option value="2">Female</option>
										<option value="3">Other</option>
									</select>
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
								<div className="col-sm-10">
									<input type="email" className="form-control" placeholder="Email" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="pphone" className="col-sm-2 col-form-label">Primary Phone</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Primary Number" />
								</div>
							</div>
							<div className="form-group row">
								<label htmlFor="ophone" className="col-sm-2 col-form-label">Other Phone</label>
								<div className="col-sm-10">
									<input type="text" className="form-control" placeholder="Other Number" />
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
