import React, { Component } from "react";
import './Style.scss';

export default class ErrorSpan extends Component {
    render() {
        return (
            <div style={{ display: this.props.IsVisible ? "block" : "none" }}>
                <span className="error-span-format">{this.props.ErrorName}</span>
            </div>
        );
    }
}