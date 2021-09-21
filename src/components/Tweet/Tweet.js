import React, { Component } from 'react';
import classes from './Tweet.module.css';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Reply from '../Reply/Reply';
import Aux from '../../hoc/Auxillary';

class Tweet extends Component {

    state = {
        replyContent: '',
        editContent: '',
        editMode: false
    }

    handleReplyDataChange = (event) => {
        let changedReplyContent = event.target.value;
        this.setState({ replyContent: changedReplyContent });
    }

    handleInitEdit = () => {
        this.setState({ editMode: true, editContent: this.props.post.content });
    }

    handleEditMode = () => {
        let editModeToChange = !this.state.editMode;
        this.setState({ editMode: editModeToChange });
    }

    postReply = () => {
        let contentToReply = this.state.replyContent;
        if (contentToReply.length != 0) {
            this.props.postReply(contentToReply, this.props.post.id);
            this.setState({replyContent: ''});
        }
    }

    changeEditContent = (event) => {
        let newContent = event.target.value;
        this.setState({ editContent: newContent });
    }

    updatePost = () => {
        this.props.updatePost(this.state.editContent, this.props.post.id, this.props.post.userName);
        this.setState({editMode: false, editContent: ''});
    }

    cancelEdit = () => {
        this.setState({ editMode: false, editContent: '' });
    }

    render() {
        let userLiked = this.props.post.likedBy !== null && this.props.post.likedBy !== undefined
            && this.props.post.likedBy.some(likedBy => likedBy === this.props.loggedInUsername);
        let noOfLikes = this.props.post.likedBy !== null && this.props.post.likedBy !== undefined ?
            this.props.post.likedBy.length : 0;
        let currentUser = this.props.post.userName === this.props.loggedInUsername;
        return (
            <Aux>
                <div className="row justify-content-center mt-3">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className={classes.cardShadow + " p-3"}>
                            <div className=" row ml-1 mr-1">
                                <div className="col-6 text-primary text-left pl-0 font-weight-bold">
                                    {this.props.post.userName}
                                </div>
                                <div className="col-6 text-right pr-0">
                                    {this.props.post.timeAgo}
                                </div>
                            </div>
                            <div className={classes.postBorder + " mt-1"}></div>
                            <div className="row mt-3 mb-3">
                                <div className={classes.contentColHeight+" col-10 text-left"}>
                                    {
                                        this.state.editMode ?
                                            <textarea className={classes.textAreaHeight} maxLength="144" id="tweet-edit"
                                                value={this.state.editContent} onChange={(event) => this.changeEditContent(event)}
                                            />
                                            : this.props.post.content
                                    }
                                </div>
                                <div className="col-2 text-right">
                                    {currentUser ? <IconButton className={classes.nilOutline + " p-0"}>
                                        <ClearOutlinedIcon style={{ fontSize: '0.8em' }} onClick={() => this.props.handleDelete(this.props.post.id)} />
                                    </IconButton>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                            <div className="row text-right">
                                <div className="col-10">
                                    {this.state.editMode ?
                                        <Aux>
                                            <DoneOutlinedIcon onClick={this.updatePost} />
                                            <ClearOutlinedIcon onClick={this.cancelEdit} />
                                        </Aux> : <span>&nbsp;&nbsp;</span>
                                    }
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-8 text-left text-primary">
                                    <IconButton className={classes.nilOutline + " p-0"} onClick={() => this.props.handleLike(this.props.post.id, this.props.idx, !userLiked)}>
                                        {userLiked ? <ThumbUpAltIcon color="primary" /> : <ThumbUpAltOutlinedIcon />}
                                    </IconButton>
                                    {noOfLikes > 0 ?
                                        <span className="align-bottom font-weight-bold">&nbsp; {noOfLikes}</span>
                                        : ' '}
                                </div>
                                <div className="col-4 text-right">
                                    {currentUser && !this.state.editMode ?
                                        <IconButton className={classes.nilOutline + " p-0"}>
                                            <EditIcon color="primary" onClick={this.handleInitEdit} />
                                        </IconButton>
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className={classes.replyTextAreaColor}>
                            <div className="row pt-1 pb-1">
                                <div className="col-12">
                                    <input id={`reply-textbox-${this.props.idx}`} placeholder="Type a reply..."
                                        style={{ width: '70%', outline: 'none', borderRadius: '5px', border: "1px solid #8C92AC" }}
                                        maxLength="144" onChange={(event) => this.handleReplyDataChange(event)} />
                                    <IconButton className={classes.nilOutline + " p-0"} onClick={() => this.postReply()}>
                                        <span className="material-icons" style={{ color: '#344955' }}>send</span>
                                    </IconButton>
                                </div>
                            </div>
                            {this.props.replies.map((reply, replyIdx) => {
                                let key = `reply-${this.props.idx}-${replyIdx}`;
                                return <Reply key={key} postIdx={this.props.idx}
                                    idx={replyIdx} reply={reply} handleReplyLike={this.props.handleReplyLike}
                                    loggedInUsername={this.props.loggedInUsername} />
                            })}
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default Tweet;