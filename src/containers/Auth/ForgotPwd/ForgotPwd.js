import React, { Component } from 'react';
import classes from './ForgotPwd.module.css';
import {
    getInputFieldStyle, getButtonStyle, initFormField,
    validateFormField, checkFieldInvalid, getHelperText, checkFormValid, getErrorResponseMsg, createJwtHeader, getCookieVals
} from '../../../utils/TweetAppUtils';
import * as constants from '../../../constants/TweetAppConstants';
import axios from '../../../tweetapp-axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

class ForgotPwd extends Component {

    state = {
        forgotPwdForm: {
            username: initFormField([{ type: 'min', value: 5 }, { type: 'nospace' }]),
            password: initFormField([{ type: 'min', value: 8 }, { type: 'max', value: 16 }]),
            confirmpwd: initFormField([{ type: 'min', value: 8 }, { type: 'max', value: 16 }]),
            phno: initFormField([{ type: 'phno' }])
        },
        openSnackbar: false,
        snackbarMessage: '',
        snackbarSeverity: ''
    }

    inputChangeHandler = (event, fieldName) => {
        let valueToUpdate = event.target.value;
        let formCopy = { ...this.state.forgotPwdForm }
        let copiedField = { ...formCopy[fieldName] };
        copiedField.value = valueToUpdate;
        let validValue = validateFormField(valueToUpdate, copiedField.validations);
        copiedField.valid = validValue;
        copiedField.dirty = true;
        formCopy[fieldName] = copiedField;
        this.setState({ forgotPwdForm: formCopy });
    }

    handleFocus = (field, value) => {
        let formCopy = { ...this.state.forgotPwdForm }
        let copiedField = { ...formCopy[field] };
        copiedField.focus = value;
        formCopy[field] = copiedField;
        this.setState({ forgotPwdForm: formCopy });
    }

    changePassword = () => {
        let newPwd = this.state.forgotPwdForm.password.value;
        let confirmPwd = this.state.forgotPwdForm.confirmpwd.value;
        if (newPwd != confirmPwd) {
            this.setState({ openSnackbar: true, snackbarMessage: 'Passwords do no match', snackbarSeverity: 'warning' });
        } else {
            let payload = {
                userName: this.state.forgotPwdForm.username.value,
                phno: this.state.forgotPwdForm.phno.value,
                newPwd: this.state.forgotPwdForm.password.value
            };
            axios.post("/forgot", payload).then(response => {
                console.log(response);
                this.setState({ openSnackbar: true, snackbarSeverity: 'success', snackbarMessage: "Successfully updated your password. Redirecting to login page..." }, () => {
                    setTimeout(() => {
                        this.props.history.push("/");
                    }, 3000);
                });
            }).catch(error => {
                let code = error.response.data.code;
                let message = "Error while changing password";
                if (code != undefined && code != null && (code === "USER_NO_EXIST" || code === "USER_PWD_SAME")) {
                    message = error.response.data.message;
                }
                this.setState({ openSnackbar: true, snackbarSeverity: 'error', snackbarMessage: message });
            });
        }
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
                            <h5 className="mt-2">Forgot Password</h5>
                        </div>
                        <div className="row pl-3 pr-3 justify-content-center">
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField id="forgot-pwd-uname"
                                    value={this.state.forgotPwdForm.username.value}
                                    error={checkFieldInvalid(this.state.forgotPwdForm, 'username')}
                                    helperText={getHelperText(this.state.forgotPwdForm, 'username', constants.USERNAME_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'username')}
                                    label="Username"
                                    InputLabelProps={getInputFieldStyle()} InputProps={getInputFieldStyle()}
                                    onFocus={() => this.handleFocus('username', true)}
                                    onBlur={() => this.handleFocus('username', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField id="forgot-pwd-phno"
                                    value={this.state.forgotPwdForm.phno.value}
                                    error={checkFieldInvalid(this.state.forgotPwdForm, 'phno')}
                                    helperText={getHelperText(this.state.forgotPwdForm, 'phno', constants.PHNO_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'phno')}
                                    label="Phone number"
                                    inputProps={{ maxLength: 10 }}
                                    InputLabelProps={getInputFieldStyle()} InputProps={getInputFieldStyle()}
                                    onFocus={() => this.handleFocus('phno', true)}
                                    onBlur={() => this.handleFocus('phno', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField id="forgot-pwd-password"
                                    value={this.state.forgotPwdForm.password.value}
                                    error={checkFieldInvalid(this.state.forgotPwdForm, 'password')}
                                    helperText={getHelperText(this.state.forgotPwdForm, 'password', constants.PASSWORD_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'password')}
                                    type="password"
                                    label="New Password"
                                    InputLabelProps={getInputFieldStyle()} InputProps={getInputFieldStyle()}
                                    onFocus={() => this.handleFocus('password', true)}
                                    onBlur={() => this.handleFocus('password', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField id="forgot-pwd-confirmpwd"
                                    value={this.state.forgotPwdForm.confirmpwd.value}
                                    error={checkFieldInvalid(this.state.forgotPwdForm, 'confirmpwd')}
                                    helperText={getHelperText(this.state.forgotPwdForm, 'confirmpwd', constants.PASSWORD_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'confirmpwd')}
                                    type="password"
                                    label="Confirm password"
                                    InputLabelProps={getInputFieldStyle()} InputProps={getInputFieldStyle()}
                                    onFocus={() => this.handleFocus('confirmpwd', true)}
                                    onBlur={() => this.handleFocus('confirmpwd', false)}
                                    fullWidth />
                            </div>
                            <div className="col-12 mt-2 mb-4">
                                <Button id="login-btn" style={getButtonStyle()}
                                    disabled={!checkFormValid(this.state.forgotPwdForm)} onClick={() => this.changePassword()}>Change password</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ForgotPwd);