import React, { Component } from 'react';
import classes from './Login.module.css';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import {
    getInputFieldStyle, getButtonStyle, initFormField,
    validateFormField, checkFieldInvalid, getHelperText, checkFormValid, getErrorResponseMsg
} from '../../../utils/TweetAppUtils';
import * as constants from '../../../constants/TweetAppConstants';
import { Link, withRouter } from 'react-router-dom';
import axios from '../../../tweetapp-axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class Login extends Component {

    state = {
        loginForm : {
            username: initFormField([{ type: 'min', value: 5 }, { type: 'nospace' }]),
            password: initFormField([{ type: 'min', value: 8 }])
        },
        openSnackbar: false,
        snackbarMessage: '',
        snackbarSeverity: ''
    }

    inputChangeHandler = (event, fieldName) => {
        let valueToUpdate = event.target.value;
        let formCopy = {...this.state.loginForm}
        let copiedField = { ...formCopy[fieldName] };
        copiedField.value = valueToUpdate;
        let validValue = validateFormField(valueToUpdate, copiedField.validations);
        copiedField.valid = validValue;
        copiedField.dirty = true;
        formCopy[fieldName] = copiedField;
        this.setState({ loginForm: formCopy });
    }

    handleFocus = (field, value) => {
        let formCopy = {...this.state.loginForm}
        let copiedField = { ...formCopy[field] };
        copiedField.focus = value;
        formCopy[field] = copiedField;
        this.setState({ loginForm: formCopy });
    }

    login = () => {
        let loginInfo = {
            userName: this.state.loginForm.username.value,
            password: this.state.loginForm.password.value
        }
        axios.post("/login", loginInfo).then(response => {
            let responseBody = response.data;
            let cookieVal = `jwt=${responseBody.jwt}, username=${responseBody.userName}`;
            document.cookie = cookieVal;
            window.location.replace("/");
        }).catch(error => {
            let message = getErrorResponseMsg(error, 'Login has failed. Please try again', "INVALID_UNAME", "INVALID_PWD");
            this.setState({ openSnackbar: true, snackbarSeverity: 'error', snackbarMessage: message }, () => {
                setTimeout(() => {
                    this.setState({ openSnackbar: false });
                }, 3000);
            });
        });
    }

    render() {
        let cardClasses = classes.cardShadow + " card";
        return (
            <div className="row justify-content-center mt-3 mb-3">
                <div className="col-sm-12 col-md-7 col-lg-4">
                    <Snackbar elevation={6} variant="filled" anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={this.state.openSnackbar} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
                        <Alert onClose={this.handleSnackbarClose} severity={this.state.snackbarSeverity}>
                            {this.state.snackbarMessage}
                        </Alert>
                    </Snackbar>
                    <div className={cardClasses}>
                        <div className="card-title">
                            <h5 className="mt-2">Login</h5>
                        </div>
                        <div className="row pl-3 pr-3">
                            <div className="col-12">
                                <TextField id="login-uname"
                                    value={this.state.loginForm.username.value}
                                    error={checkFieldInvalid(this.state.loginForm, 'username', 'login-uname')}
                                    helperText={getHelperText(this.state.loginForm, 'username', constants.USERNAME_ERR_MSG, 'login-uname')}
                                    onChange={(event) => this.inputChangeHandler(event, 'username')}
                                    label="Username"
                                    InputLabelProps={getInputFieldStyle()} InputProps={getInputFieldStyle()}
                                    onFocus={() => this.handleFocus('username', true)}
                                    onBlur={() => this.handleFocus('username', false)}
                                    fullWidth />
                            </div>
                            <div className="col-12 mt-2">
                                <TextField id="login-pwd"
                                    value={this.state.loginForm.password.value}
                                    error={checkFieldInvalid(this.state.loginForm, 'password')}
                                    helperText={getHelperText(this.state.loginForm, 'password', constants.PASSWORD_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'password')}
                                    type="password"
                                    label="Password"
                                    InputLabelProps={getInputFieldStyle()} InputProps={getInputFieldStyle()}
                                    onFocus={() => this.handleFocus('password', true)}
                                    onBlur={() => this.handleFocus('password', false)}
                                    fullWidth />
                            </div>
                            <div className="col-12 text-center mt-3">
                                <Link to="/forgot" style={{ textDecoration: 'none' }}>Forgot password?</Link>
                            </div>
                            <div className="col-12 mt-2">
                                <Button id="login-btn" style={getButtonStyle()}
                                    disabled={!checkFormValid(this.state.loginForm)} onClick={() => this.login()}>Login</Button>
                            </div>
                            <div className="col-12 text-center mt-3 mb-3">
                                <Link to="/signup" style={{ textDecoration: 'none' }}>New user? Signup here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);