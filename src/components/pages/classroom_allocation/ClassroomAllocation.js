import React, { Component } from 'react';
import { get, post, del } from "../../../utility/apiClient";
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Button, Label, Input, Table } from 'reactstrap';
import './Style.scss';

class AllocateClassrooms extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            teacherID: "",
            classroomID: "",
            allocatedClassrooms: [],
            teachers: [],
            classrooms: [],
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadTeachers();
        this.loadClassrooms();
        this.loadAllocatedClassrooms(); // Initially load all allocated classrooms
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

    loadClassrooms() {
        get('Classroom/Classrooms').then(response => {
            if (response.data.statusCode === 200 && this._isMounted) {
                this.setState({ classrooms: response.data.result || [] });
            } else {
                console.error(`Failed to load classrooms. | ${response.data.errorMessage}`);
            }
        });
    }

    loadAllocatedClassrooms() {
        const { teacherID } = this.state;
        if (teacherID) {
            get(`AllocateClassroom/GetAllocatedClassroomsByTeacher/${teacherID}`).then(response => {
                if (response.data.statusCode === 200 && this._isMounted) {
                    this.setState({ allocatedClassrooms: response.data.result || [] });
                } else {
                    console.error(`Failed to load allocated classrooms. | ${response.data.errorMessage}`);
                }
            });
        }
    }

    handleChangeEvent = (event) => {
        this.setState({ [event.target.name]: parseInt(event.target.value) }, () => {
            if (event.target.name === "teacherID") {
                this.loadAllocatedClassrooms(); // Load allocated classrooms whenever teacherID changes
            }
        });
    };

    saveAllocation = () => {
        const { teacherID, classroomID } = this.state;
        if (teacherID && classroomID) {
            const formData = { TeacherID: teacherID, ClassroomID: classroomID };
            post('AllocateClassroom/AllocateClassroomForTeacher', formData).then(response => {
                if (response.data.statusCode === 200) {
                    this.loadAllocatedClassrooms(); // Reload allocated classrooms after saving
                } else {
                    console.error(`Failed to allocate classroom. | ${response.data.errorMessage}`);
                }
            });
        }
    };

    deallocateClassroom = (allocationID) => {
        del(`AllocateClassroom/DeallocateClassroomForTeacher/${allocationID}`).then(response => {
            if (response.data.statusCode === 200) {
                this.loadAllocatedClassrooms(); // Reload allocated classrooms after deallocating
            } else {
                console.error(`Failed to deallocate classroom. | ${response.data.errorMessage}`);
            }
        });
    };

    render() {
        const { classrooms, teachers, allocatedClassrooms, teacherID, classroomID } = this.state;
        return (
            <div>
                <Row>
                    <Col md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-cube"></i> Allocate Classrooms
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
                                        <Label>Classroom</Label>
                                        <Row>
                                            <Col md="6">
                                                <Input type="select" name="classroomID" value={classroomID} onChange={this.handleChangeEvent}>
                                                    <option value="">Select a classroom</option>
                                                    {classrooms.map((classroom, index) => (
                                                        <option key={index} value={classroom.classroomID}>{classroom.classroomName}</option>
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
                                                    <th>Classrooms</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allocatedClassrooms.map((allocation, index) => (
                                                    allocation ? (
                                                        <tr key={index}>
                                                            <td>{allocation.classroomName}</td>
                                                            <td>
                                                                <Button className="btn btn-danger" onClick={() => this.deallocateClassroom(allocation.allocateClassroomID)}>Deallocate</Button>
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

export default AllocateClassrooms;
