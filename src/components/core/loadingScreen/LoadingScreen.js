import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import './Style.scss';

class LoadingScreen extends Component {
    render() {
        return (
            <div style={this.props.isVisible ? { display: '' } : { display: 'none' }} className="full-width-div">
                <Spinner color="success" />
            </div>
        )
    }
}

export default LoadingScreen