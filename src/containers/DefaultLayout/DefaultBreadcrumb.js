import React, { Component } from 'react';
import routes from "../../routes";
import { Link } from 'react-router-dom';
import './Style.scss';

class DefaultBreadcrumb extends Component {
    constructor(props) {
        super(props)
        this.resetBreadcrumb = this.resetBreadcrumb.bind(this);

        this.state = {
            currentPath: ""
        }
    };

    resetBreadcrumb() {
        this.props.resetBreadcrumb();
    };

    componentDidMount() {
        if (window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] !== "home") {
            routes.forEach(route => {
                if (window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] == route.path.split('/')[route.path.split('/').length - 1]) {
                    this.setState({
                        currentPath: route.name
                    }, () => {
                        document.getElementById("default-breadcrumb-arrow_id").style.display = "block";
                    });
                }
            })
        } else {
            document.getElementById("default-breadcrumb-arrow_id").style.display = "none";
        }
    };

    render() {
        return (
            <div id="default-breadcrumb_id" className="default-breadcrumb">
                <Link to="/home" onClick={this.resetBreadcrumb.bind(this)}>
                    <div className="default-breadcrumb-home">
                        <i className="fas fa-home default-breadcrumb-home-icon" />
                    </div>
                </Link>
                <div id="default-breadcrumb-arrow_id" style={{ float: "left" }}>
                    <i className="fas fa-caret-right default-breadcrumb-arrow" />
                </div>
                <div className="default-breadcrumb-item">
                    <a>{this.state.currentPath}</a>
                </div>
            </div>
        )
    }
}
export default DefaultBreadcrumb