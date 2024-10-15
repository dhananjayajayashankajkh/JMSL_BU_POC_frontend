import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from "../../routes";
import DefaultBreadcrumb from './DefaultBreadcrumb';
import logo from '../../assets/img/logo.png';
import userImg from '../../assets/img/user.jpg';
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

class DefaultHeader extends Component {
    constructor(props) {
        super(props)
        this.setBreadcrumb = this.setBreadcrumb.bind(this);
        this.resetBreadcrumb = this.resetBreadcrumb.bind(this);
        this.handleNavMenuOutsideClick = this.handleNavMenuOutsideClick.bind(this);

        this.state = {
            menuList: [],
            isMenuLoaded: false,
            navMenuVisible: false,
            userPopupVisible: false,
            currentRoutePath: ""
        }
    };

    componentDidMount() {
        this.props.showLoadingScreen();
        this.setState({
            menuList: routes,
            isMenuLoaded: true
        }, () => {
            this.toggleSideMenu();
            this.props.hideLoadingScreen();
        })
    };

    toggleSideMenu() {
        if (!this.state.navMenuVisible) {
            // attach/remove event handler
            document.addEventListener('click', this.handleNavMenuOutsideClick, false);
            let sideMenu = document.getElementById("default-sidebar_id");
            sideMenu.classList.replace('sidebar-menu-close', 'sidebar-menu-open');
        } else {
            document.removeEventListener('click', this.handleNavMenuOutsideClick, false);
            let sideMenu = document.getElementById("default-sidebar_id");
            sideMenu.classList.replace('sidebar-menu-open', 'sidebar-menu-close');
        }

        this.setState(prevState => ({
            navMenuVisible: !prevState.navMenuVisible,
        }));
    };

    handleNavMenuOutsideClick(event) {
        if (event !== null && event.target !== null && event.target.id !== null) {
            if (event.target.id === "main_menu_toggler_icon") {
                this.setState(prevState => ({
                    navMenuVisible: !prevState.navMenuVisible,
                }, () => { this.toggleSideMenu() }));
            } else {
                if (this.navMenuNode) {
                    if (this.navMenuNode.contains(event.target)) {
                        return;
                    }
                    this.setState({
                        navMenuVisible: true
                    }, () => { this.toggleSideMenu() });
                }
            }
        }
    };

    setBreadcrumb(routePath) {
        this.setState({
            currentRoutePath: routePath
        })
    };

    resetBreadcrumb() {
        this.setState({
            currentRoutePath: ""
        })
    };

    render() {
        return (
            <div>
                <header className="default-app-header">
                    {/*-- Header logo & title container --*/}
                    <div className="app-header-logo-container">
                        <a href={window.location.origin + "/home"}>
                            <img src={logo} className="app-header-logo" alt="FIANP Logo" />
                        </a>
                        <div className="app-header-menu-toggler" onClick={this.toggleSideMenu.bind(this)}>
                            <i id="main_menu_toggler_icon" className="fas fa-bars"></i>
                        </div>
                    </div>
                    {/*-- Header user popup container --*/}
                    <div className="app-header-user-container">
                        <img src={userImg} className="app-header-user_image" alt="User Image" />
                    </div>
                    {/*-- Side main navigation menu --*/}
                    <div id="default-sidebar_id" className="default-sidebar sidebar-menu-open" ref={node => { this.navMenuNode = node; }}>
                        <div className="default-navbar">
                            <nav className="nav-item">
                                <li><Link to="/home" htmlFor="tm" id="toggle-menu" onClick={() => { this.setBreadcrumb("/home") }}>
                                    <i className="fa fa-home nav-icon" /> Home</Link>
                                </li>
                            </nav>
                            {this.state.isMenuLoaded && this.state.menuList ?
                                this.state.menuList.map((menu, index) => (
                                    <nav key={index} className="nav-item">
                                        <li
                                            key={index}
                                            className='nav-item-list'>
                                            <Link
                                                style={{ display: 'flex', alignItems: 'baseline' }}
                                                key={index} to={menu.path} onClick={() => { this.setBreadcrumb(menu.path) }}>
                                                <i className={menu.icon + " nav-icon"} />
                                                <label className="nav-title" style={{ marginLeft: 5, width: '100%' }} htmlFor={`menu_${index}`}> {menu.name} </label>
                                            </Link>
                                        </li>
                                    </nav>
                                ))
                                : null
                            }
                        </div>
                    </div>
                </header>
                <DefaultBreadcrumb key={this.state.currentRoutePath} resetBreadcrumb={this.resetBreadcrumb} />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader);