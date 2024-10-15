import React, { Component } from 'react';
import './Style.scss';

export default class Collapsible extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isCollapsed: false,
            classname: "collapsible-close"
        }
    }

    componentDidMount() {
        if (this.props.isCollapsed)
            if (this.props.isCollapsed == true)
                this.toggle();
            else
                this.setState({ classname: "collapsible-open" })
        else
            this.setState({ classname: "collapsible-open" })
    };

    toggle() {
        var element = document.getElementById(this.props.id)
        if (element !== null) {
            this.setState({ isCollapsed: !this.state.isCollapsed })
            if (this.state.isCollapsed) {
                element.setAttribute("style", "display:''");
                this.setState({ classname: "collapsible-open" })
            } else {
                element.setAttribute("style", "display:none");
                this.setState({ classname: "collapsible-close" })
            }
        }
    };

    render() {
        return (
            <a className={this.state.classname} onClick={this.toggle.bind(this)}><i className="fa fa-chevron-down"></i></a>
        )
    }
}