import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, ModalBody, Modal } from 'reactstrap';
import './Style.scss';

/*-- Imports for redux --*/
import { connect } from 'react-redux';
import { resetMessageBox } from '../../../redux/actions/messageBoxActions';

/*-- Map the redux states to props --*/
function mapStateToProps(state) {
    return {
        messageBox: state.messageBox
    }
};

/*-- Map the redux actions to props --*/
const mapDispatchToProps = {
    resetMessageBox
};

/**
 * Date     :   2020-06-21
 * Author   :   Dinushka Rukshan
 * Remarks  :   Global message box with redux state
 */
class MessageBox extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    };

    handleCallBackFunction(response) {
        if (this.props.messageBox.callBackFunction != null) {
            this.props.resetMessageBox();
            this.props.messageBox.callBackFunction(response);
        } else {
            this.props.resetMessageBox();
        }
    };

    render() {
        return (
            <div>
                <Modal size="md" centered className="message-box" isOpen={this.props.messageBox.show === undefined ? false : this.props.messageBox.show}>
                    <ModalBody>
                        <Card>
                            <CardHeader className={`message-box-header-${this.props.messageBox.className}`}>
                                {this.props.messageBox.title === undefined ? "" : this.props.messageBox.title}
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="12" xs="12">
                                        {this.props.messageBox.content === undefined ? "" : this.props.messageBox.content}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12" xs="12" />
                                </Row>
                                <Row style={{ position: "relative", float: "right", bottom: "-35px" }}>
                                    <Button size="sm" className="message-box-button" style={{ display: this.props.messageBox.isConfirmation ? "" : "none" }} onClick={() => { this.handleCallBackFunction(true) }}>Yes</Button>
                                    <Button size="sm" className="message-box-button" style={{ display: this.props.messageBox.isConfirmation ? "" : "none" }} onClick={() => { this.handleCallBackFunction(false) }}>No</Button>
                                    <Button size="sm" className="message-box-button" style={{ display: this.props.messageBox.isConfirmation ? "none" : "" }} onClick={() => { this.handleCallBackFunction(true) }}>Ok</Button>
                                </Row>
                            </CardBody>
                        </Card>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox);