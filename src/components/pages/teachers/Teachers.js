import React, { Component } from 'react';
import { Collapsible, ErrorSpan } from '../../core';
import { get, post, del } from "../../../utility/apiClient";
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Button, Label, Input } from 'reactstrap';
import './Style.scss';

/*-- Imports for redux --*/
import { connect } from 'react-redux';
import { showMessageBox, resetMessageBox } from '../../../redux/actions/messageBoxActions';
import { showLoadingScreen, hideLoadingScreen } from '../../../redux/actions/loadingScreenActions';

/**
 * Author   :   Bimidu Gunathilake
 * Remarks  :   This is a basic user interface used for CRUD operations
 */

/*-- Map the redux states to props --*/
function mapStateToProps(state) {
    return {}
}

/*-- Map the redux actions to props --*/
const mapDispatchToProps = {
    showMessageBox,
    resetMessageBox,
    showLoadingScreen,
    hideLoadingScreen
};

class Teachers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherID: 0,
            firstName: "",
            lastName: "",
            contactNo: "",
            email: "",
            firstNameError: "",
            contactNoError: "",
            emailAddressError: "",
            existingTeacherList: []
        };
    }

    componentDidMount() {
        this.loadExistingTeachers();
    }

    handleChangeEvent = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        this.validateField(name, value); // Validate on change
    };

    validateField(fieldName, value) {
        switch (fieldName) {
            case 'firstName':
                this.setState({ firstNameError: value.trim() === "" ? 'First name is required' : '' });
                break;
            case 'contactNo':
                const contactNoRegex = /^[0-9]{10}$/;
                this.setState({ contactNoError: !contactNoRegex.test(value) ? 'Contact number must be 10 digits' : '' });
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                this.setState({ emailAddressError: !emailRegex.test(value) ? 'Email address is invalid' : '' });
                break;
            default:
                break;
        }
    }

    validateSaveData() {
        let isValid = true;
        if (this.state.firstName.trim() === "") {
            isValid = false;
            this.setState({ firstNameError: 'First name is required' });
        }
        const contactNoRegex = /^[0-9]{10}$/;
        if (!contactNoRegex.test(this.state.contactNo)) {
            isValid = false;
            this.setState({ contactNoError: 'Contact number must be 10 digits' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.state.email)) {
            isValid = false;
            this.setState({ emailAddressError: 'Email address is invalid' });
        }
        return isValid;
    }

    resetFormData(showConfirmation) {
        if (showConfirmation) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "warning",
                content: "Are you sure you want to reset the form data?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.setState({
                            teacherID: 0,
                            firstName: "",
                            lastName: "",
                            contactNo: "",
                            email: "",
                            firstNameError: "",
                            contactNoError: "",
                            emailAddressError: ""
                        });
                    }
                }
            };
            this.props.showMessageBox(messageBox);
        } else {
            this.setState({
                teacherID: 0,
                firstName: "",
                lastName: "",
                contactNo: "",
                email: "",
                firstNameError: "",
                contactNoError: "",
                emailAddressError: ""
            });
        }
    }

    loadSelectedTeacherData(selectedTeacher) {
        if (selectedTeacher) {
            this.setState({
                teacherID: selectedTeacher.teacherID,
                firstName: selectedTeacher.firstName,
                lastName: selectedTeacher.lastName,
                contactNo: selectedTeacher.contactNo,
                email: selectedTeacher.email
            });
        }
    }

    loadExistingTeachers() {
        this.props.showLoadingScreen();
        get('Teacher/Teachers').then(response => {
            this.props.hideLoadingScreen();
            if (response.data.statusCode === 200) {
                if (response.data.result !== null) {
                    this.setState({
                        existingTeacherList: response.data.result
                    });
                }
            } else {
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Get existing teachers failed. You may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                };
                this.props.showMessageBox(messageBox);
                console.error(`Get existing teachers failed. | ${response.data.errorMessage}`);
            }
        });
    }

    deleteFormData() {
        if (this.state.teacherID !== 0) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "error",
                content: "Are you sure you want to delete this teacher?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.props.showLoadingScreen();
                        del(`Teacher/Teacher/${this.state.teacherID}`).then(response => {
                            this.props.hideLoadingScreen();
                            if (response.data.statusCode === 200) {
                                let messageBox = {
                                    show: true,
                                    title: "Success",
                                    className: "success",
                                    content: "Teacher details successfully deleted",
                                    isConfirmation: false,
                                    callBackFunction: () => {
                                        this.resetFormData(false);
                                        this.loadExistingTeachers();
                                    }
                                };
                                this.props.showMessageBox(messageBox);
                            } else {
                                let messageBox = {
                                    show: true,
                                    title: "Oops!",
                                    className: "warning",
                                    content: "This teacher is already assigned a classroom or a subject.",
                                    isConfirmation: false,
                                    callBackFunction: null
                                };
                                this.props.showMessageBox(messageBox);
                                console.error(`Delete teacher failed. | ${response.data.errorMessage}`);
                            }
                        });
                    }
                }
            };
            this.props.showMessageBox(messageBox);
        } else {
            let messageBox = {
                show: true,
                title: "Warning",
                className: "warning",
                content: "Please select an existing teacher",
                isConfirmation: false,
                callBackFunction: null
            };
            this.props.showMessageBox(messageBox);
        }
    }

    saveFormData() {
        if (this.validateSaveData()) {
            let formData = {
                TeacherID: this.state.teacherID,
                FirstName: this.state.firstName,
                LastName: this.state.lastName,
                ContactNo: this.state.contactNo,
                Email: this.state.email
            };
            this.props.showLoadingScreen();
            post("Teacher/Teacher", formData).then(response => {
                this.props.hideLoadingScreen();
                if (response.data.statusCode === 200) {
                    let messageBox = {
                        show: true,
                        title: "Success",
                        className: "success",
                        content: `Teacher details successfully ${this.state.teacherID === 0 ? "saved" : "updated"}`,
                        isConfirmation: false,
                        callBackFunction: () => {
                            this.resetFormData(false);
                            this.loadExistingTeachers();
                        }
                    };
                    this.props.showMessageBox(messageBox);
                } else {
                    let messageBox = {
                        show: true,
                        title: "Oops!",
                        className: "error",
                        content: "Save teacher details failed. You may be able to try again.",
                        isConfirmation: false,
                        callBackFunction: null
                    };
                    this.props.showMessageBox(messageBox);
                    console.error(`Save teacher details failed. | ${response.data.errorMessage}`);
                }
            });
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-chalkboard-teacher"></i> Teacher Details
                                <Collapsible id="teacher_input_criteria_id" />
                            </CardHeader>
                            <CardBody id="teacher_input_criteria_id">
                                <FormGroup row>
                                    <Col md="6" sm="6" xs="12">
                                        <Label>First Name *</Label>
                                        <Input id="first_name_id" name="firstName" type="text" value={this.state.firstName} maxLength={50} autoComplete="off"
                                            onChange={this.handleChangeEvent.bind(this)} />
                                        <ErrorSpan IsVisible={true} ErrorName={this.state.firstNameError} />
                                    </Col>
                                    <Col md="6" sm="6" xs="12">
                                        <Label>Last Name</Label>
                                        <Input id="last_name_id" name="lastName" type="text" value={this.state.lastName} maxLength={50} autoComplete="off"
                                            onChange={this.handleChangeEvent.bind(this)} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="6" xs="12">
                                        <Label>Contact No *</Label>
                                        <Input id="contact_no_id" name="contactNo" type="text" value={this.state.contactNo} maxLength={15} autoComplete="off"
                                            onChange={this.handleChangeEvent.bind(this)} />
                                        <ErrorSpan IsVisible={true} ErrorName={this.state.contactNoError} />
                                    </Col>
                                    <Col md="6" sm="6" xs="12">
                                        <Label>Email Address *</Label>
                                        <Input id="email_address_id" name="email" type="email" value={this.state.email} maxLength={50} autoComplete="off"
                                            onChange={this.handleChangeEvent.bind(this)} />
                                        <ErrorSpan IsVisible={true} ErrorName={this.state.emailAddressError} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <Button type="button" color="success" onClick={() => this.saveFormData()}><i className="fa fa-check"></i> Save</Button> &nbsp;
                                        <Button type="button" color="danger" onClick={() => this.deleteFormData()}><i className="fa fa-trash"></i> Delete</Button> &nbsp;
                                        <Button type="button" color="warning" onClick={() => this.resetFormData(true)}><i className="fa fa-undo"></i> Reset</Button>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-th-list"></i> Existing Teachers
                                <Collapsible id="teacher_existing_teachers_id" />
                            </CardHeader>
                            <CardBody id="teacher_existing_teachers_id">
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Contact No</th>
                                                        <th>Email Address</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <React.Fragment>
                                                        {
                                                            this.state.existingTeacherList.map((teacher, key) => (
                                                                <tr key={key} onClick={() => this.loadSelectedTeacherData(teacher)} style={{ cursor: "pointer" }}>
                                                                    <td>{teacher.firstName}</td>
                                                                    <td>{teacher.lastName}</td>
                                                                    <td>{teacher.contactNo}</td>
                                                                    <td>{teacher.email}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Teachers);
