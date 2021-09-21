import React, { Component } from 'react';
import classes from './User.module.css'

class User extends Component {

    render() {
        return (
            <div className={classes.cardShadow + " col-sm-12 col-md-6 col-lg-4 p-2"}>
                <div className="row text-left text-primary text-bold">
                    <div className="col-12">
                        {this.props.user.userName}
                    </div>
                </div>
                <div className={classes.postBorder + " mt-1"}></div>
                <div className="row">
                    <div className="col-6 text-left font-weight-bold">
                        {this.props.user.firstName + " " + this.props.user.lastName}
                    </div>
                    <div className="col-6 text-right">
                        {this.props.user.phno}
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-12 text-left">
                        Email: {this.props.user.email}
                    </div>
                </div>
            </div>
        )
    }
}

export default User;