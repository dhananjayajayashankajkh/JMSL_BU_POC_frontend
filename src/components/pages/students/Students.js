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
};

/*-- Map the redux actions to props --*/
const mapDispatchToProps = {
    showMessageBox,
    resetMessageBox,
    showLoadingScreen,
    hideLoadingScreen
};

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentID: 0,
            firstName: "",
            firstNameError: "",
            lastName: "",
            lastNameError: "",
            contactPerson: "",
            contactPersonError: "",
            contactNo: "",
            contactNoError: "",
            email: "",
            emailError: "",
            dob: "",
            dobError: "",
           
            classroomID: "",
            classrooms: [],
            selectedClassroom: "",
            existingStudentList: []
        }
    }

    componentDidMount() {
        this.loadExistingStudents();
        this.loadClassrooms(); // Load classrooms when the component mounts
    }

    loadClassrooms() {
        this.props.showLoadingScreen();
        get('Classroom/Classrooms').then(response => {
            this.props.hideLoadingScreen();
            if (response.data.statusCode === 200) {
                this.setState({
                    classrooms: response.data.result
                });
            } else {
              let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Get existing classrooms failed. You may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                this.props.showMessageBox(messageBox);
                console.error(`Get existing classrooms failed. | ${response.data.errorMessage}`);
            }
        });
    }

    handleChangeEvent = (event) => {
        const { name, value } = event.target;
    
        if (name === "dob") {
            const age = this.calculateAge(value);
            this.setState({ dob: value, age });
        } else if (name === "selectedClassroom") {
            this.setState({ selectedClassroom: parseInt(value, 10) }); 
        } else {
            this.setState({ [name]: value });
        }
    
        switch (name) {
            case "firstName":
                this.setState({ firstNameError: "" });
                break;
            case "lastName":
                this.setState({ lastNameError: "" });
                break;
            case "contactPerson":
                this.setState({ contactPersonError: "" });
                break;
            case "contactNo":
                this.setState({ contactNoError: "" });
                break;
            case "email":
                this.setState({ emailError: "" });
                break;
            case "dob":
                this.setState({ dobError: "" }); 
                break;
            default:
                break;
        }
    }

    calculateAge(dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age; 
    }
    
    formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    getClassroomName(classroomID) {
        const classroom = this.state.classrooms.find(c => c.classroomID === classroomID);
        return classroom ? classroom.classroomName : 'Unknown';
    }

    resetFormData(showConfirmation) {
        if (showConfirmation) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "warning",
                content: "Are you sure you want to reset the form data.?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.setState({
                            studentID: 0,
                            firstName: "",
                            firstNameError: "",
                            lastName: "",
                            lastNameError: "",
                            contactPerson: "",
                            contactPersonError: "",
                            contactNo: "",
                            contactNoError: "",
                            email: "",
                            emailError: "",
                            dob: "",
                            age: "",
                            selectedClassroom: ""
                        })
                    }
                }
            }
            this.props.showMessageBox(messageBox);
        } else {
            this.setState({
                studentID: 0,
                firstName: "",
                firstNameError: "",
                lastName: "",
                lastNameError: "",
                contactPerson: "",
                contactPersonError: "",
                contactNo: "",
                contactNoError: "",
                email: "",
                emailError: "",
                dob: "",
                age: "",
                selectedClassroom: ""
            })
        }
    }

    loadSelectedStudentData(selectedStudent) {
        if (selectedStudent) {
            this.setState({
                studentID: selectedStudent.studentID,
                firstName: selectedStudent.firstName,
                lastName: selectedStudent.lastName,
                contactPerson: selectedStudent.contactPerson,
                contactNo: selectedStudent.contactNo,
                email: selectedStudent.email,
                dob: this.formatDate(selectedStudent.dob),
                age: this.calculateAge(selectedStudent.dob),
                selectedClassroom: selectedStudent.classroomID
            })
        }
    }

    validateSaveData() {
        let isValidate = true;
        
        // Validate First Name
        if (this.state.firstName.trim() === "") {
            isValidate = false;
            this.setState({ firstNameError: 'First name is required' });
        }
    
        // Validate Last Name
        if (this.state.lastName.trim() === "") {
            isValidate = false;
            this.setState({ lastNameError: 'Last name is required' });
        }
    
        // Validate Contact Person
        if (this.state.contactPerson.trim() === "") {
            isValidate = false;
            this.setState({ contactPersonError: 'Contact person is required' });
        }
    
        // Validate Contact Number
        if (this.state.contactNo.trim() === "") {
            isValidate = false;
            this.setState({ contactNoError: 'Contact number is required' });
        } else if (!/^\d{10}$/.test(this.state.contactNo)) {
            isValidate = false;
            this.setState({ contactNoError: 'Contact number must be exactly 10 digits' });
        }
    
        // Validate Email
        if (this.state.email.trim() === "") {
            isValidate = false;
            this.setState({ emailError: 'Email address is required' });
        } else if (!/\S+@\S+\.\S+/.test(this.state.email)) {
            isValidate = false;
            this.setState({ emailError: 'Email address is invalid' });
        }
    
        // Validate Date of Birth
        if (this.state.dob.trim() === "") {
            isValidate = false;
            this.setState({ dobError: 'Date of birth is required' });
        } else {
            const today = new Date();
            const dob = new Date(this.state.dob);
            if (dob >= today) {
                isValidate = false;
                this.setState({ dobError: 'Date of birth must be a past date' });
            }
        }
    
        return isValidate;
    }
    

    loadExistingStudents() {
        this.props.showLoadingScreen();
        get('Student/Students').then(response => {
            this.props.hideLoadingScreen();
            if (response.data.statusCode === 200) {
                this.setState({
                    existingStudentList: response.data.result
                })
            } else {
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Get existing students failed.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                this.props.showMessageBox(messageBox);
                console.error(`Get existing students failed. | ${response.data.errorMessage}`);
            }
        })
    }

    deleteFormData() {
        if (this.state.studentID !== 0) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "error",
                content: "Are you sure you want to delete this student.?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.props.showLoadingScreen();
                        del(`Student/Student/${this.state.studentID}`).then(response => {
                            this.props.hideLoadingScreen();
                            if (response.data.statusCode === 200) {
                                let messageBox = {
                                    show: true,
                                    title: "Success",
                                    className: "success",
                                    content: "Student details successfully deleted",
                                    isConfirmation: false,
                                    callBackFunction: () => {
                                        this.resetFormData(false);
                                        this.loadExistingStudents();
                                    }
                                }
                                this.props.showMessageBox(messageBox);
                            } else {
                                let messageBox = {
                                    show: true,
                                    title: "Oops!",
                                    className: "error",
                                    content: "Delete student failed.\nYou may be able to try again.",
                                    isConfirmation: false,
                                    callBackFunction: null
                                }
                                this.props.showMessageBox(messageBox);
                                console.error(`Delete student failed. | ${response.data.errorMessage}`);
                            }
                        })
                    }
                }
            }
            this.props.showMessageBox(messageBox);
        } else {
            let messageBox = {
                show: true,
                title: "Warning",
                className: "warning",
                content: "Please select an existing student",
                isConfirmation: false,
                callBackFunction: null
            }
            this.props.showMessageBox(messageBox);
        }
    }
    saveFormData() {
        if (this.validateSaveData()) {
            let formData = {
                StudentID: this.state.studentID,
                FirstName: this.state.firstName,
                LastName: this.state.lastName,
                ContactPerson: this.state.contactPerson,
                ContactNo: this.state.contactNo,
                Email: this.state.email,
                DOB: this.state.dob,
                ClassroomID: parseInt(this.state.selectedClassroom, 10) 
            }
            this.props.showLoadingScreen();
            post("Student/Student", formData).then(response => {
                this.props.hideLoadingScreen();
                if (response.data.statusCode === 200) {
                    let messageBox = {
                        show: true,
                        title: "Success",
                        className: "success",
                        content: `Student details successfully ${this.state.studentID === 0 ? "saved" : "updated"}`,
                        isConfirmation: false,
                        callBackFunction: () => {
                            this.resetFormData(false);
                            this.loadExistingStudents();
                        }
                    }
                    this.props.showMessageBox(messageBox);
                } else {
                    let messageBox = {
                        show: true,
                        title: "Oops!",
                        className: "error",
                        content: `Save student failed.\nYou may be able to try again.\nError: ${response.data.errorMessage}`,
                        isConfirmation: false,
                        callBackFunction: null
                    }
                    this.props.showMessageBox(messageBox);
                    console.error(`Save student failed. | ${response.data.errorMessage}`);
                }
            })
        }
    }
    
    

    render() {

        const today = new Date().toISOString().split('T')[0];

        return (
            <div>
                <Row>
                    <Col md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-cube"></i> Student Details
                                <Collapsible id="student_input_criteria_id" />
                            </CardHeader>
                            <CardBody id="student_input_criteria_id">
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>First Name</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="first_name_id" name="firstName" type="text" value={this.state.firstName} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.firstNameError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Last Name</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="last_name_id" name="lastName" type="text" value={this.state.lastName} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.lastNameError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Contact Person</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="contact_person_id" name="contactPerson" type="text" value={this.state.contactPerson} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.contactPersonError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Contact No.</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="contact_no_id" name="contactNo" type="text" value={this.state.contactNo} maxLength={10} autoComplete="off"
                                                    onChange={this.handleChangeEvent} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.contactNoError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Email Address</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="email_id" name="email" type="email" value={this.state.email} maxLength={100} autoComplete="off"
                                                    onChange={this.handleChangeEvent} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.emailError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Date of Birth</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="dob_id" name="dob" type="date" value={this.state.dob} autoComplete="off" max={today}
                                                    onChange={this.handleChangeEvent} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.dobError} /> 
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Age</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="age_id" name="age" type="text" value={this.state.age} disabled />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Classroom</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="classroom_id" name="selectedClassroom" type="select" value={this.state.selectedClassroom} onChange={this.handleChangeEvent}>
                                                    <option value="">Select Classroom</option>
                                                    {this.state.classrooms.map((classroom, index) => (
                                                        <option key={index} value={classroom.classroomID}>{classroom.classroomName}</option>
                                                    ))}
                                                </Input>
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col className="offset-3" md="3" sm="3" xs="3">
                                        <Button block className="btn btn-success mr-2" onClick={this.saveFormData.bind(this)}>{this.state.studentID === 0 ? "Save" : "Update"}</Button>
                                    </Col>
                                    <Col md="3" sm="3" xs="3">
                                        <Button block className="btn btn-danger" onClick={this.deleteFormData.bind(this)}>Delete</Button>
                                    </Col>
                                    <Col md="3" sm="3" xs="3">
                                        <Button block className="btn btn-warning" onClick={() => this.resetFormData(true)}>Reset</Button>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <i className="fa fa-cube"></i> Existing Students
                                    <Collapsible id="student_exist_student_details_id" />
                            </CardHeader>
                            <CardBody id="student_exist_student_details_id">
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="exist-student-table">
                                                <tbody>
                                                    <tr style={{ color: "white", backgroundColor: "#6c757d" }}>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Contact Person</th>
                                                        <th>Contact No.</th>
                                                        <th>Email</th>
                                                        <th>DOB</th>
                                                        <th>Age</th>
                                                        <th>Classroom</th>
                                                    </tr>
                                                    <React.Fragment>
                                                        {
                                                            this.state.existingStudentList.map((student, index) => (
                                                                <tr key={index} onClick={this.loadSelectedStudentData.bind(this, student)}>
                                                                    <td>{student.firstName}</td>
                                                                    <td>{student.lastName}</td>
                                                                    <td>{student.contactPerson}</td>
                                                                    <td>{student.contactNo}</td>
                                                                    <td>{student.email}</td>
                                                                    <td>{this.formatDate(student.dob)}</td>
                                                                    <td>{this.calculateAge(student.dob)}</td>
                                                                    <td>{this.getClassroomName(student.classroomID)}</td>
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
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Students);
