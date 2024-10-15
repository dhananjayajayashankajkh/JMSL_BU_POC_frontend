import React, { Component } from 'react';
import { get, post, del } from "../../../utility/apiClient";
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Button, Label, Input, Table } from 'reactstrap';
import './Style.scss';

class AllocateSubjects extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            teacherID: "",
            subjectID: "",
            allocatedSubjects: [],
            teachers: [],
            subjects: [],
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadTeachers();
        this.loadSubjects();
        this.loadAllocatedSubjects(); // Initially load all allocated subjects
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadTeachers() {
        get('Teacher/Teachers').then(response => {
            if (response.data.statusCode === 200 && this._isMounted) {
                this.setState({ teachers: response.data.result });
            } else {
                console.error(`Failed to load teachers. | ${response.data.errorMessage}`);
            }
        });
    }

    loadSubjects() {
        get('Subject/Subjects').then(response => {
            if (response.data.statusCode === 200 && this._isMounted) {
                this.setState({ subjects: response.data.result || [] });
            } else {
                console.error(`Failed to load subjects. | ${response.data.errorMessage}`);
            }
        });
    }

    loadAllocatedSubjects() {
        const { teacherID } = this.state;
        if (teacherID) {
            get(`AllocateSubject/GetAllocatedSubjectsByTeacher/${teacherID}`).then(response => {
                if (response.data.statusCode === 200 && this._isMounted) {
                    this.setState({ allocatedSubjects: response.data.result || [] });
                } else {
                    console.error(`Failed to load allocated subjects. | ${response.data.errorMessage}`);
                }
            });
        }
    }

    handleChangeEvent = (event) => {
        this.setState({ [event.target.name]: parseInt(event.target.value) }, () => {
            if (event.target.name === "teacherID") {
                this.loadAllocatedSubjects(); // Load allocated subjects whenever teacherID changes
            }
        });
    };

    saveAllocation = () => {
        const { teacherID, subjectID } = this.state;
        if (teacherID && subjectID) {
            const formData = { TeacherID: teacherID, SubjectID: subjectID };
            post('AllocateSubject/AllocateSubjectForTeacher', formData).then(response => {
                if (response.data.statusCode === 200) {
                    this.loadAllocatedSubjects(); // Reload allocated subjects after saving
                } else {
                    console.error(`Failed to allocate subject. | ${response.data.errorMessage}`);
                }
            });
        }
    };

    deallocateSubject = (allocationID) => {
        del(`AllocateSubject/DeallocateSubjectForTeacher/${allocationID}`).then(response => {
            if (response.data.statusCode === 200) {
                this.loadAllocatedSubjects(); // Reload allocated subjects after deallocating
            } else {
                console.error(`Failed to deallocate subject. | ${response.data.errorMessage}`);
            }
        });
    };

    render() {
        const { subjects, teachers, allocatedSubjects, teacherID, subjectID } = this.state;
        return (
            <div>
                <Row>
                    <Col md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-cube"></i> Allocate Subjects
                            </CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="12">
                                        <Label>Teacher</Label>
                                        <Row>
                                            <Col md="6">
                                                <Input type="select" name="teacherID" value={teacherID} onChange={this.handleChangeEvent}>
                                                    <option value="">Select a teacher</option>
                                                    {teachers.map((teacher, index) => (
                                                        <option key={index} value={teacher.teacherID}>{teacher.firstName} {teacher.lastName}</option>
                                                    ))}
                                                </Input>
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="12">
                                        <Label>Subject</Label>
                                        <Row>
                                            <Col md="6">
                                                <Input type="select" name="subjectID" value={subjectID} onChange={this.handleChangeEvent}>
                                                    <option value="">Select a subject</option>
                                                    {subjects.map((subject, index) => (
                                                        <option key={index} value={subject.subjectID}>{subject.subjectName}</option>
                                                    ))}
                                                </Input>
                                            </Col>
                                            <Col md="6">
                                                <Button className="btn btn-primary" onClick={this.saveAllocation}>Allocate</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="12">
                                        <Table>
                                            <thead>
                                                <tr style={{ backgroundColor: "#e9ecef" }}>
                                                    <th>Subjects</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allocatedSubjects.map((allocation, index) => (
                                                    allocation ? (
                                                        <tr key={index}>
                                                            <td>{allocation.subjectName}</td>
                                                            <td>
                                                                <Button className="btn btn-danger" onClick={() => this.deallocateSubject(allocation.allocateSubjectID)}>Deallocate</Button>
                                                            </td>
                                                        </tr>
                                                    ) : null
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

export default AllocateSubjects;
