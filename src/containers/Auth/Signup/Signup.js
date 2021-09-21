import React, { Component } from 'react';
import classes from './Signup.module.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as constants from '../../../constants/TweetAppConstants'
import {
    getButtonStyle, getInputFieldStyle, validateFormField, checkFieldInvalid, initFormField,
    getHelperText, checkFormValid, getErrorResponseMsg
} from '../../../utils/TweetAppUtils';
import { withRouter } from 'react-router-dom'
import axios from '../../../tweetapp-axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class Signup extends Component {

    state = {
        signupform: {
            fname: initFormField([{ type: 'min', value: 3 }]),
            lname: initFormField([{ type: 'min', value: 3 }]),
            email: initFormField([{ type: 'email' }]),
            username: initFormField([{ type: 'min', value: 5 }, { type: 'nospace' }]),
            pwd: initFormField([{ type: 'min', value: 8 }, { type: 'max', value: 16 }]),
            confirmpwd: initFormField([{ type: 'min', value: 8 }, { type: 'max', value: 16 }]),
            phno: initFormField([{ type: 'phno' }])
        },
        openSnackbar: false,
        snackbarSeverity: '',
        snackbarMessage: ''
    }

    inputChangeHandler = (event, fieldName) => {
        let valueToUpdate = event.target.value;
        let signupFormCopy = { ...this.state.signupform }
        let copiedField = { ...signupFormCopy[fieldName] };
        copiedField.value = valueToUpdate;
        let validValue = validateFormField(valueToUpdate, copiedField.validations);
        copiedField.valid = validValue;
        copiedField.dirty = true;
        signupFormCopy[fieldName] = copiedField;
        this.setState({ signupform: signupFormCopy });
    }

    handleFocus = (field, value) => {
        let signupFormCopy = { ...this.state.signupform }
        let copiedField = { ...signupFormCopy[field] };
        copiedField.focus = value;
        signupFormCopy[field] = copiedField;
        this.setState({ signupform: signupFormCopy });
    }

    signup = () => {
        let signupInfo = { 
            fname: this.state.signupform.fname.value,
            lname: this.state.signupform.lname.value,
            email: this.state.signupform.email.value,
            username: this.state.signupform.username.value,
            pwd: this.state.signupform.pwd.value,
            phno: this.state.signupform.phno.value
        };
        if (this.state.signupform.pwd.value !== this.state.signupform.confirmpwd.value) {
            this.setState({ openSnackbar: true, snackbarSeverity: 'warning', snackbarMessage: 'Passwords do not match' }, () => {
                setTimeout(() => {
                    this.setState({ openSnackbar: false });
                }, 3000);
            });
        } else {
            axios.post("/register", signupInfo).then(success => {
                this.setState({ openSnackbar: true, snackbarSeverity: 'success', snackbarMessage: 'Signup is successful. Redirecting to login page' }, () => {
                    setTimeout(() => {
                        this.setState({ openSnackbar: false });
                        this.props.history.push("/login");
                    }, 3000);
                });
            }).catch(error => {
                let message = getErrorResponseMsg(error, 'Signup has failed. Please try again', 'SIGNUP_FAILED');
                this.setState({ openSnackbar: true, snackbarSeverity: 'error', snackbarMessage: message }, () => {
                    setTimeout(() => {
                        this.setState({ openSnackbar: false });
                    }, 3000);
                });
            });
        }
    }

    handleSnackbarClose = () => {
        this.setState({ openSnackbar: false });
    }

    render() {
        let cardClasses = classes.cardShadow + " card";
        return (
            <div className="row justify-content-center mt-5 mb-5">
                <div className="col-sm-12 col-md-8 col-lg-6">
                    <Snackbar elevation={6} variant="filled" anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={this.state.openSnackbar} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
                        <Alert onClose={this.handleSnackbarClose} severity={this.state.snackbarSeverity}>
                            {this.state.snackbarMessage}
                        </Alert>
                    </Snackbar>
                    <div className={cardClasses}>
                        <div className="card-title">
                            <h5 className="mt-2">Signup</h5>
                        </div>
                        <div className="row justify-content-center pl-3 pr-3">
                            <div className="col-10 col-md-8 col-lg-6 mt-1">
                                <TextField
                                    id="signup-fname"
                                    label="First name"
                                    InputProps={getInputFieldStyle()}
                                    InputLabelProps={getInputFieldStyle()}
                                    value={this.state.signupform.fname.value}
                                    error={checkFieldInvalid(this.state.signupform, 'fname')}
                                    helperText={getHelperText(this.state.signupform, 'fname', constants.FNAME_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'fname')}
                                    onFocus={() => this.handleFocus('fname', true)}
                                    onBlur={() => this.handleFocus('fname', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-1">
                                <TextField
                                    id="signup-lname"
                                    label="Last name"
                                    InputProps={getInputFieldStyle()}
                                    InputLabelProps={getInputFieldStyle()}
                                    value={this.state.signupform.lname.value}
                                    error={checkFieldInvalid(this.state.signupform, 'lname')}
                                    helperText={getHelperText(this.state.signupform, 'lname', constants.LNAME_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'lname')}
                                    onFocus={() => this.handleFocus('lname', true)}
                                    onBlur={() => this.handleFocus('lname', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField
                                    id="signup-email"
                                    label="Email id"
                                    InputProps={getInputFieldStyle()}
                                    InputLabelProps={getInputFieldStyle()}
                                    value={this.state.signupform.email.value}
                                    error={checkFieldInvalid(this.state.signupform, 'email')}
                                    helperText={getHelperText(this.state.signupform, 'email', constants.EMAIL_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'email')}
                                    onFocus={() => this.handleFocus('email', true)}
                                    onBlur={() => this.handleFocus('email', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField
                                    id="signup-username"
                                    label="Username"
                                    InputProps={getInputFieldStyle()}
                                    InputLabelProps={getInputFieldStyle()}
                                    value={this.state.signupform.username.value}
                                    error={checkFieldInvalid(this.state.signupform, 'username')}
                                    helperText={getHelperText(this.state.signupform, 'username', constants.USERNAME_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'username')}
                                    onFocus={() => this.handleFocus('username', true)}
                                    onBlur={() => this.handleFocus('username', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField
                                    id="signup-pwd"
                                    label="Password"
                                    type="password"
                                    InputProps={getInputFieldStyle()}
                                    InputLabelProps={getInputFieldStyle()}
                                    value={this.state.signupform.pwd.value}
                                    error={checkFieldInvalid(this.state.signupform, 'pwd')}
                                    helperText={getHelperText(this.state.signupform, 'pwd', constants.PASSWORD_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'pwd')}
                                    onFocus={() => this.handleFocus('pwd', true)}
                                    onBlur={() => this.handleFocus('pwd', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField
                                    id="signup-confirmpwd"
                                    label="Confirm Password"
                                    type="password"
                                    InputProps={getInputFieldStyle()}
                                    InputLabelProps={getInputFieldStyle()}
                                    value={this.state.signupform.confirmpwd.value}
                                    error={checkFieldInvalid(this.state.signupform, 'confirmpwd')}
                                    helperText={getHelperText(this.state.signupform, 'confirmpwd', constants.PASSWORD_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'confirmpwd')}
                                    onFocus={() => this.handleFocus('confirmpwd', true)}
                                    onBlur={() => this.handleFocus('confirmpwd', false)}
                                    fullWidth />
                            </div>
                            <div className="col-10 col-md-8 col-lg-6 mt-2">
                                <TextField
                                    id="signup-phno"
                                    label="Phone number"
                                    InputProps={getInputFieldStyle()}
                                    InputLabelProps={getInputFieldStyle()}
                                    inputProps={{ maxLength: 10 }}
                                    error={checkFieldInvalid(this.state.signupform, 'phno')}
                                    helperText={getHelperText(this.state.signupform, 'phno', constants.PHNO_ERR_MSG)}
                                    onChange={(event) => this.inputChangeHandler(event, 'phno')}
                                    onFocus={() => this.handleFocus('phno', true)}
                                    onBlur={() => this.handleFocus('phno', false)}
                                    fullWidth />
                            </div>
                            <div className="col-12 mt-3 mb-3">
                                <Button id="signup-btn" style={getButtonStyle()}
                                    disabled={!checkFormValid(this.state.signupform)} onClick={() => this.signup()}>Signup</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Signup);