import React, { Component } from 'react';
import classes from './NavBar.module.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {withRouter} from 'react-router-dom';
import SideDrawer from './SideDrawer/SideDrawer';
import {getCookieVals} from '../../utils/TweetAppUtils';

const nonLoggedInLinks = [
    [{to:'/login', text:'Login'}],
    [{to:'/signup', text:'Signup'}],
    [{to: '/forgot', text: 'Forgot password'}]
]

const loggedInLinks = [
    [{to: '/', text: 'Home'}],
    [{to: '/users/search', text: 'Find Users'}]
]

class NavBar extends Component {

    state = {
        showDrawer: false
    }

    routingHandler = (path) => {
        this.props.history.push(path);
    }

    toggleDrawer = (show) => {
        this.setState({showDrawer: show});
    }

    logout = () => {
        document.cookie = "jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC;"
        window.location.replace("/");
    }

    render() {
        let navbarCls = classes.navbarColor + " navbar";
        let cookieVals = getCookieVals();
        let loggedIn = cookieVals.length == 2 && !cookieVals.includes('');
        let linksToShow = loggedIn ? loggedInLinks : nonLoggedInLinks;
        return (
            <div className={navbarCls}>
                <Typography variant="h6">
                    Tweet App
                </Typography>
                <SideDrawer showDrawer={this.state.showDrawer}
                    toggleDrawer={this.toggleDrawer}
                    links={linksToShow}
                    toggleHandler={this.toggleHandler}
                    routingHandler={this.routingHandler} />
                {!loggedIn ? <Button className="ml-auto" style={{ 'outline': 'none' }} 
                    color="inherit" onClick={() => this.routingHandler("/login")}>Login</Button>
                :
                <Button className="ml-auto" style={{ 'outline': 'none' }} 
                    color="inherit" onClick={() => this.logout()}>Logout</Button>}
                <IconButton style={{ 'outline': 'none' }} color="inherit" aria-label="menu"
                    onClick={() => this.toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
            </div>
        )
    }
}

export default withRouter(NavBar);