import React, { Component, Suspense } from 'react';
import routes from "../../routes";
import { Redirect, Route, Switch } from "react-router-dom";
import MessageBox from '../../components/core/messageBox/MessageBox';
import LoadingScreen from '../../components/core/loadingScreen/LoadingScreen';
import DefaultHeader from './DefaultHeader';
import './Style.scss';

/**-- Imports for redux --*/
import { connect } from 'react-redux';
import { showLoadingScreen, hideLoadingScreen } from '../../redux/actions/loadingScreenActions';

// map the redux states to props
function mapStateToProps(state) {
    return {
        loadingScreenVisible: state.loadingScreen
    }
};

// map the redux actions to props
const mapDispatchToProps = {
    showLoadingScreen,
    hideLoadingScreen
};

class DefaultLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    };

    loading = () => (
        <LoadingScreen isVisible={true} />
    );

    render() {
        return (
            <div>
                <DefaultHeader />
                <div id="default-app-body">
                    <div id="default-app-content_id" className="default-app-content">
                        <Suspense fallback={this.loading()}>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component
                                                    screenId={route.id}
                                                    {...props}
                                                />
                                            )}
                                        />
                                    ) : (null);
                                })}
                                <Redirect from="/" to="/home" />
                            </Switch>
                        </Suspense>
                    </div>
                </div>
                <div className="default-app-footer">
                    <span className="ml-auto">Copyright © {new Date().getFullYear()} Jaykay Marketing Services (Pvt) Ltd.</span>
                </div>
                <MessageBox />
                <LoadingScreen isVisible={this.props.loadingScreenVisible} />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);