import React, { Component } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Login from './Auth/Login/Login';
import Signup from './Auth/Signup/Signup'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter, Route } from 'react-router-dom'
import { Switch } from 'react-router';
import Home from '../containers/Home/Home';
import { getCookieVals } from '../utils/TweetAppUtils';
import ForgotPwd from './Auth/ForgotPwd/ForgotPwd';
import UserSearch from './UserSearch/UserSearch';

class Root extends Component {

    getMuiTheme = () => {
        return createMuiTheme({
            typography: {
                'font-family': `"Poppins", sans-serif`,
                "fontWeightLight": 300,
                "fontWeightRegular": 400,
                "fontWeightMedium": 500
            },
            palette: {
                type: "light"
            }
        })
    }

    render() {
        let cookieVals = getCookieVals();
        let loggedIn = cookieVals.length == 2;
        return (
            <BrowserRouter>
                <ThemeProvider theme={this.getMuiTheme()}>
                    <CssBaseline />
                    <div className="container-fluid m-0">
                        <div className="row">
                            <div className="col-12 p-0">
                                <NavBar />
                            </div>
                        </div>
                        {!loggedIn ?
                            <Switch>
                                <Route path="/login" exact component={Login}></Route>
                                <Route path="/signup" exact component={Signup}></Route>
                                <Route path="/forgot" exact component={ForgotPwd}></Route>
                                <Route path="/" exact component={Login}></Route>
                            </Switch>
                            :
                            <Switch>
                                <Route path="/users/search" exact component={UserSearch}></Route>
                                <Route path="/" exact component={Home}></Route>
                            </Switch>
                        }
                    </div>
                </ThemeProvider>
            </BrowserRouter >
        );
    }
}

export default Root;