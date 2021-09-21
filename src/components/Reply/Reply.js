import React, { Component } from 'react';
import classes from './Reply.module.css';
import Aux from '../../hoc/Auxillary';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import IconButton from '@material-ui/core/IconButton';

class Reply extends Component {

    render() {
        return (
            <div className={classes.replyComponent + " pl-3 pr-3 pt-1 pb-1"}>
                <div className="row">
                    <div className="col-6 text-left">
                        {this.props.reply.userName}
                    </div>
                    <div className="col-6 text-right">
                        {this.props.reply.timeAgo}
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-12 text-left">
                        {this.props.reply.content}
                    </div>
                </div>
            </div>
        )
    }
}

export default Reply;