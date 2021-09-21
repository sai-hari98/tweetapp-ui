import React, {Component} from 'react';
import classes from './NoResults.module.css';

class NoResults extends Component{

    render(){
        return (
            <div className="row justify-content-center">
                <div className={classes.background}>
                </div>
                <div className="col-12">
                    {this.props.message}
                </div>
            </div>
        )
    }
}

export default NoResults;