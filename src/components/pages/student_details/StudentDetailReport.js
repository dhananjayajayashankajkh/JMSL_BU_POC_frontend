import React, { Component } from 'react';
import { get } from "../../../utility/apiClient";
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Label, Input, Table } from 'reactstrap';
import './Style.scss';

/*-- Imports for redux --*/
import { connect } from 'react-redux';
import { showMessageBox, resetMessageBox } from '../../../redux/actions/messageBoxActions';
import { showLoadingScreen, hideLoadingScreen } from '../../../redux/actions/loadingScreenActions';

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

class StudentDetailReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentID: "",
            contactPerson: "",
            contactNo: "",
            email: "",
            dob: "",
            age: "",
            classroomID: "",
            classroom: "",
            subjects: [],
            students: [],
            classrooms: [] 
        }
    }

    componentDidMount() {
        this.loadStudents();
        this.loadClassrooms();
    }

    loadStudents() {
        this.props.showLoadingScreen();
        get('Student/Students').then(response => {
            this.props.hideLoadingScreen();
            if (response.data.statusCode === 200) {
                this.setState({ students: response.data.result });
            } else {
                this.props.showMessageBox({
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: `Failed to load students. ${response.data.errorMessage}`,
                    isConfirmation: false,
                    callBackFunction: null
                });
                console.error(`Failed to load students. | ${response.data.errorMessage}`);
            }
        });
    }

    loadClassrooms() {
        // Load classrooms to display classroom names in the report
        this.props.showLoadingScreen();
        get('Classroom/Classrooms').then(response => {
            this.props.hideLoadingScreen();
            if (response.data.statusCode === 200) {
                this.setState({ classrooms: response.data.result });
            } else {
                this.props.showMessageBox({
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: `Failed to load classrooms. ${response.data.errorMessage}`,
                    isConfirmation: false,
                    callBackFunction: null
                });
                console.error(`Failed to load classrooms. | ${response.data.errorMessage}`);
            }
        });
    }

    loadStudentDetails(studentID) {
        if (studentID) {
            this.props.showLoadingScreen();
            get(`Student/GetStudentByID/${studentID}`).then(response => {
                this.props.hideLoadingScreen();
                if (response.data.statusCode === 200) {
                    const student = response.data.result;
                    this.setState({
                        contactPerson: student.contactPerson,
                        contactNo: student.contactNo,
                        email: student.email,
                        dob: this.formatDate(student.dob), 
                        age: this.calculateAge(student.dob),
                        classroomID: student.classroomID,
                        classroom: this.getClassroomName(student.classroomID),
                        subjects: student.subjectTeachers 
                    });
                } else {
                    this.props.showMessageBox({
                        show: true,
                        title: "Oops!",
                        className: "error",
                        content: `Failed to load student details. ${response.data.errorMessage}`,
                        isConfirmation: false,
                        callBackFunction: null
                    });
                    console.error(`Failed to load student details. | ${response.data.errorMessage}`);
                }
            });
        } else {
            // Reset details if no student is selected
            this.setState({
                contactPerson: "",
                contactNo: "",
                email: "",
                dob: "",
                age: "",
                classroomID: "",
                classroom: "",
                subjects: []
            });
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US'); // Format date to MM/DD/YYYY
    }
    

    handleChangeEvent = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        if (name === 'studentID') {
            this.loadStudentDetails(value);
        }
    };

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

    getClassroomName(classroomID) {
        const classroom = this.state.classrooms.find(c => c.classroomID === classroomID);
        return classroom ? classroom.classroomName : 'Unknown';
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-user"></i> Student Detail Report
                            </CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="6">
                                        <Label>Student</Label>
                                        <Input type="select" name="studentID" value={this.state.studentID} onChange={this.handleChangeEvent}>
                                            <option value="">Select a student</option>
                                            {this.state.students.map((student, index) => (
                                                <option key={index} value={student.studentID}>{student.firstName} {student.lastName}</option>
                                            ))}
                                        </Input>
                                    </Col>
                                    <Col md="6">
                                        <Label>Classroom</Label>
                                        <Input type="text" name="classroom" value={this.getClassroomName(this.state.classroomID)} readOnly />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6">
                                        <Label>Contact Person</Label>
                                        <Input type="text" name="contactPerson" value={this.state.contactPerson} readOnly />
                                    </Col>
                                    <Col md="6">
                                        <Label>Email address</Label>
                                        <Input type="text" name="email" value={this.state.email} readOnly />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6">
                                        <Label>Contact No.</Label>
                                        <Input type="text" name="contactNo" value={this.state.contactNo} readOnly />
                                    </Col>
                                    <Col md="6">
                                        <Label>Date of Birth</Label>
                                        <Input type="text" name="dob" value={this.state.dob} readOnly />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="12">
                                        <Table>
                                            <thead>
                                                <tr style={{ backgroundColor: "#e9ecef" }}>
                                                    <th>Subject</th>
                                                    <th>Teacher</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.subjects.map((subject, index) => (
                                                    <tr key={index}>
                                                        <td>{subject.subjectName}</td>
                                                        <td>{subject.teacherFirstName} {subject.teacherLastName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetailReport);
