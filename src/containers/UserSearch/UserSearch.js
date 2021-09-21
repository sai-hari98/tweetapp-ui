import React, { Component } from 'react';
import classes from './UserSearch.module.css';
import axios from '../../tweetapp-axios';
import { getCookieVals, createJwtHeader } from '../../utils/TweetAppUtils';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Aux from '../../hoc/Auxillary';
import User from '../../components/User/User';
import NoResults from '../../components/NoResults/NoResults';

const errorMsg = 'Error while fetching users';

class UserSearch extends Component {

    state = {
        users: [],
        username: null,
        jwt: null
    }

    componentDidMount() {
        let cookies = getCookieVals();
        let jwt = cookies[0];
        let username = cookies[1];
        this.setState({ username: username, jwt: jwt }, this.getAllUsers);
    }

    getAllUsers = () => {
        let cookies = getCookieVals();
        let jwt = cookies[0];
        let username = cookies[1];
        let config = createJwtHeader(jwt);
        axios.get("/users/all", config).then(response => {
            let users = response.data.users;
            this.setState({ users: users });
        }).catch(error => {
            this.setState({ openSnackbar: true, snackbarSeverity: 'error', snackbarMessage: errorMsg });
        });
    }

    searchHandler = (event) => {
        let searchInput = event.target.value;
        if(searchInput.length >= 3){
            let cookies = getCookieVals();
            let jwt = cookies[0];
            let config = createJwtHeader(jwt);
            axios.get(`/user/search/${searchInput}`, config).then(response => {
                let users = response.data.users;
                users = users != undefined && users != null ? users : [];
                this.setState({users: users});
            }).catch(error => {
                this.setState({snackbarMessage: 'Error while calling search service', snackbarSeverity: 'error',
                                openSnackbar: true});
            });
        }

        if(searchInput.length === 0){
            this.getAllUsers();
        }
    }

    handleSnackbarClose = () => {
        this.setState({openSnackbar: false, snackbarMessage: '', snackbarSeverity: ''});
    }

    render() {
        return (
            <Aux>
                <div className="row justify-content-center mt-5">
                    <div className="col-sm-10 col-md-8 col-lg-5">
                        <Snackbar elevation={6} variant="filled" anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={this.state.openSnackbar} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
                            <Alert onClose={this.handleSnackbarClose} severity={this.state.snackbarSeverity}>
                                {this.state.snackbarMessage}
                            </Alert>
                        </Snackbar>
                        <input className={classes.searchBox} id="search-box" placeholder="Search for users..." 
                            onChange={(event) => this.searchHandler(event)}/>
                    </div>
                </div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        {this.state.users !== undefined && this.state.users !== null &&
                            this.state.users.length > 0 ? 
                            this.state.users.map((user, index) => <User key={`user-${index}`} 
                            loggedInUser={this.state.username} user={user} />) : <NoResults message = "No users found for the search"/>
                        }
                    </div>
                </div>
            </Aux>
        )
    }
}

export default UserSearch;