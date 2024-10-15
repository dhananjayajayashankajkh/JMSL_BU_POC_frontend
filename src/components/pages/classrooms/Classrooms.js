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

class Classroom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classroomID: 0,
            classroomName: "",
            classroomNameError: "",
            existingClassroomList: []
        }
    };

    componentDidMount() {
        this.loadExistingClassrooms();
    };

    handleChangeEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.name === "classroomName") {
            this.setState({ classroomNameError: "" });
        }
    };

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
                            classroomID: 0,
                            classroomName: "",
                            classroomNameError: ""
                        })
                    }
                }
            }
            this.props.showMessageBox(messageBox);
        } else {
            this.setState({
                classroomID: 0,
                classroomName: "",
                classroomNameError: ""
            })
        }
    };

    loadSelectedClassroomData(selectedClassroom) {
        if (selectedClassroom) {
            this.setState({
                classroomID: selectedClassroom.classroomID,
                classroomName: selectedClassroom.classroomName
            })
        }
    };

    validateSaveData() {
        let isValidate = true;
        if (this.state.classroomName === "" || this.state.classroomName === null) {
            isValidate = false;
            this.setState({ classroomNameError: 'Classroom name is required' });
        }
        return isValidate;
    };

    loadExistingClassrooms() {
        this.props.showLoadingScreen();
        get('Classroom/Classrooms').then(response => {
            this.props.hideLoadingScreen();
            if (response.data.statusCode === 200) {
                if (response.data.result !== null) {
                    this.setState({
                        existingClassroomList: response.data.result
                    })
                }
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
        })
    };

    deleteFormData() {
        if (this.state.classroomID !== 0) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "error",
                content: "Are you sure you want to delete this classroom?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.props.showLoadingScreen();
                        del(`Classroom/Classroom/${this.state.classroomID}`).then(response => {
                            this.props.hideLoadingScreen();
                            if (response.data.statusCode === 200) {
                                let messageBox = {
                                    show: true,
                                    title: "Success",
                                    className: "success",
                                    content: "Classroom details successfully deleted",
                                    isConfirmation: false,
                                    callBackFunction: () => {
                                        this.resetFormData(false);
                                        this.loadExistingClassrooms();
                                    }
                                }
                                this.props.showMessageBox(messageBox);
                            } else {
                                let messageBox = {
                                    show: true,
                                    title: "Oops!",
                                    className: "error",
                                    content: "Delete classroom failed. You may be able to try again.",
                                    isConfirmation: false,
                                    callBackFunction: null
                                }
                                this.props.showMessageBox(messageBox);
                                console.error(`Delete classroom failed. | ${response.data.errorMessage}`);
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
                content: "Please select an existing classroom",
                isConfirmation: false,
                callBackFunction: null
            }
            this.props.showMessageBox(messageBox);
        }
    };

    saveFormData() {
        if (this.validateSaveData()) {
            let formData = {
                ClassroomID: this.state.classroomID,
                ClassroomName: this.state.classroomName
            };
            this.props.showLoadingScreen();
            post("Classroom/Classroom", formData).then(response => {
                this.props.hideLoadingScreen();
                if (response.data.statusCode === 200) {
                    let messageBox = {
                        show: true,
                        title: "Success",
                        className: "success",
                        content: `Classroom details successfully ${this.state.classroomID === 0 ? "saved" : "updated"}`,
                        isConfirmation: false,
                        callBackFunction: () => {
                            this.resetFormData(false);
                            this.loadExistingClassrooms();
                        }
                    };
                    this.props.showMessageBox(messageBox);
                } else {
                    let messageBox = {
                        show: true,
                        title: "Oops!",
                        className: "error",
                        content: "Save classroom details failed. You may be able to try again.",
                        isConfirmation: false,
                        callBackFunction: null
                    };
                    this.props.showMessageBox(messageBox);
                    console.error(`Save classroom details failed. | ${response.data.errorMessage}`);
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
                                <i className="fa fa-cube"></i> Classroom Details
                                <Collapsible id="classroom_input_criteria_id" />
                            </CardHeader>
                            <CardBody id="classroom_input_criteria_id">
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Classroom Name</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="classroom_name_id" name="classroomName" type="text" value={this.state.classroomName} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.classroomNameError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col className="offset-3" md="3" sm="3" xs="3">
                                        <Button block className="btn btn-success mr-2" onClick={this.saveFormData.bind(this)}>{this.state.classroomID === 0 ? "Save" : "Update"}</Button>
                                    </Col>
                                    <Col md="3" sm="3" xs="3">
                                        <Button block className="btn btn-danger" onClick={this.deleteFormData.bind(this)}>Delete</Button>
                                    </Col>
                                    <Col md="3" sm="3" xs="3">
                                        <Button block className="btn btn-warning" onClick={this.resetFormData.bind(this)}>Reset</Button>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-cube"></i> Existing Classrooms
                                <Collapsible id="classroom_exist_classroom_details_id" />
                            </CardHeader>
                            <CardBody id="classroom_exist_classroom_details_id">
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="exist-classroom-table">
                                                <tbody>
                                                    <tr style={{ color: "white", backgroundColor: "#6c757d" }}>
                                                        <th>Classroom Name</th>
                                                    </tr>
                                                    <React.Fragment>
                                                        {
                                                            this.state.existingClassroomList.map((classroom, index) => (
                                                                <tr key={index} onClick={this.loadSelectedClassroomData.bind(this, classroom)} style={{ cursor: "pointer" }}>
                                                                    <td>{classroom.classroomName}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(Classroom);
