import React, { Component } from 'react';
import classes from './Home.module.css';
import Aux from '../../hoc/Auxillary';
import Fab from '@material-ui/core/Fab';
import Tweet from '../../components/Tweet/Tweet';
import axios from '../../tweetapp-axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import NoResults from '../../components/NoResults/NoResults';
import { getCookieVals, createJwtHeader } from '../../utils/TweetAppUtils';

class Home extends Component {

    state = {
        postContent: '',
        posts: [],
        postDropDwnSelection: 'all',
        openSnackbar: false,
        snackbarSeverity: '',
        snackbarMessage: '',
        jwt: '',
        username: ''
    }

    componentDidMount() {
        let cookieVals = getCookieVals();
        this.setState({ jwt: cookieVals[0], username: cookieVals[1] }, () => {
            this.callPostsGetUrl("/all");
        });
    }

    inputChangeHandler = (event) => {
        this.setState({ postContent: event.target.value })
    }

    handleLike = (id, index, liked) => {
        axios.put(`/${this.state.username}/like/${id}`, {}, createJwtHeader(this.state.jwt)).then(response => {
            this.updateLikeData(index, liked);
        }).catch(error => {
            this.setState({ openSnackbar: true, snackbarSeverity: 'Error', snackbarMessage: 'Error while liking tweet' });
        });
    }

    updateLikeData = (index, liked) => {
        let postsCopy = [...this.state.posts]
        let postCopy = { ...postsCopy[index] };
        if (postCopy.likedBy == undefined || postCopy.likedBy == null) {
            postCopy.likedBy = [];
        }
        if (liked) {
            postCopy.likedBy.push(this.state.username);
        } else {
            let index = postCopy.likedBy.findIndex(like => like === this.state.username);
            postCopy.likedBy.splice(index, 1);
        }
        postsCopy[index] = postCopy;
        this.setState({ posts: postsCopy });
    }

    handleReplyLike = (postIdx, replyIdx) => {
        let postsCopy = [...this.state.posts]
        let eleCopy = { ...postsCopy[postIdx] };
        let repliesCopy = [...eleCopy.replies];
        let replyCopy = { ...repliesCopy[replyIdx] };
        replyCopy.userLiked = !replyCopy.userLiked;
        let noOfLikes = replyCopy.userLiked ? ++replyCopy.noOfLikes : --replyCopy.noOfLikes;
        replyCopy.noOfLikes = noOfLikes;
        repliesCopy[replyIdx] = replyCopy;
        eleCopy.replies = repliesCopy;
        postsCopy[postIdx] = eleCopy;
        this.setState({ posts: postsCopy });
    }

    updatePostTweetData = (id) => {
        let tweetContent = this.state.postContent;
        if (tweetContent.length > 0) {
            let tweetObj = {
                id: id,
                userName: this.state.username,
                content: tweetContent,
                timeAgo: 'Just now',
                likedBy: [],
                userLiked: false,
                replies: []
            };
            let tweetsCopy = [...this.state.posts];
            tweetsCopy.push(tweetObj);
            tweetsCopy.reverse();
            this.setState({ posts: tweetsCopy });
        }
    }

    postReply = (reply, postIdx) => {
        let replyPayload = {
            userName: this.state.username,
            content: reply
        }
        let config = createJwtHeader(this.state.jwt);
        axios.post(`/reply/${postIdx}`, replyPayload, config).then(response => {
            let postsCopy = [...this.state.posts];
            let index = postsCopy.findIndex(post => post.id === postIdx)
            let postCopy = { ...postsCopy[index] };
            let replies = postCopy.replies !== undefined || postCopy.replies != null ?
                [...postCopy.replies] : [];
            let replyObj = {
                userName: this.state.username,
                content: reply,
                timeAgo: 'Just now'
            }
            replies.push(replyObj);
            replies.reverse();
            postCopy.replies = replies;
            postsCopy[index] = postCopy;
            this.setState({ posts: postsCopy });
        }).catch(error => {
            this.setState({ openSnackbar: true, snackbarSeverity: 'error', snackbarMessage: 'Error while posting reply for tweet' });
        });
    }

    postTweet = () => {
        let post = {
            tweet: {
                userName: this.state.username,
                content: this.state.postContent
            }
        };
        axios.post("/add", post, createJwtHeader(this.state.jwt)).then(response => {
            let id = response.data.data;
            this.updatePostTweetData(id);
        }).catch(error => {
            this.setState({ openSnackbar: true, snackbarSeverity: 'Error', snackbarMessage: 'Error while posting tweet' });
        })
    }

    handleDelete = (id) => {
        axios.delete(`/${this.state.username}/delete/${id}`, createJwtHeader(this.state.jwt)).then(response => {
            let postsCopy = [...this.state.posts];
            let index = postsCopy.findIndex(post => post.id === id);
            let splicedPosts = postsCopy.splice(index, 1);
            this.setState({ posts: postsCopy });
        }).catch(error => {
            this.setState({ openSnackbar: true, snackbarSeverity: 'Error', snackbarMessage: 'Error while deleting tweet' });
        })
    }

    handlePostDropDwnChange = (event) => {
        let val = event.target.value;
        let url = val === 'all' ? '/all' : `/users/${this.state.username}`;
        this.callPostsGetUrl(url);
        this.setState({ postDropDwnSelection: val });
    }

    callPostsGetUrl = (url) => {
        axios.get(url, createJwtHeader(this.state.jwt)).then(response => {
            let posts = response.data.tweets;
            this.setState({ posts: posts });
        }).catch(error => {
            let message = 'Error while fetching posts';
            this.setState({ openSnackbar: true, snackbarSeverity: 'error', snackbarMessage: message }, () => {
                setTimeout(() => {
                    this.setState({ openSnackbar: false });
                }, 3000);
            });
        })
    }

    updatePostContentInState = (content, id, username, callbackFn) => {
        let postsCopy = [...this.state.posts];
        let index = postsCopy.findIndex(post => post.id === id);
        let postCopy = { ...postsCopy[index] };
        postCopy.content = content;
        postsCopy[index] = postCopy;
        this.setState({ posts: postsCopy }, () => callbackFn(content, id, username));
    }

    updatePost = (content, id, username) => {
        let callbackFn = (content, id, username) => {
            let postsCopy = [...this.state.posts];
            let index = postsCopy.findIndex(post => post.id === id);
            let postCopy = { ...postsCopy[index] };
            let oldContent = postCopy.content;
            postCopy.content = content;
            let payload = {
                tweet: postCopy
            }
            let config = createJwtHeader(this.state.jwt);
            axios.put(`/${username}/update/${id}`, payload, config).then(response => {
                this.setState({ openSnackbar: true, snackbarMessage: 'Tweet has been updated', snackbarSeverity: 'success' });
            }).catch(error => {
                postCopy.content = oldContent;
                postsCopy[index] = postCopy;
                this.setState({ posts: postsCopy, openSnackbar: true, snackbarMessage: 'Error while updating tweet', snackbarSeverity: 'error' });
            });
        }
        this.updatePostContentInState(content, id, username, callbackFn);
    }

    render() {
        let textAreaColClsses = classes.textAreaCol + " col-12 col-md-8 col-lg-6"
        return (
            <Aux>
                <Snackbar elevation={6} variant="filled" anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={this.state.openSnackbar} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
                    <Alert onClose={this.handleSnackbarClose} severity={this.state.snackbarSeverity}>
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
                <div className="row mt-4 justify-content-center">
                    <div className={textAreaColClsses}>
                        <textarea id="new-post" maxLength="144"
                            className={classes.textArea} rows="10"
                            placeholder="Type something..."
                            value={this.state.postContent}
                            onChange={(event) => this.inputChangeHandler(event)}></textarea>
                        <div />
                    </div>
                </div>
                <div className="row mt-2 justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 text-right">
                        <Fab aria-label="Post" className={classes.postBtn} onClick={() => this.postTweet()}>
                            <span className="material-icons text-white">create</span>
                        </Fab>
                        {/* <button className={classes.floatingBtn}>
                            <span className="material-icons text-white text-center">create</span>
                        </button> */}
                    </div>
                </div>
                <div className="row mt-2 justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 text-right">
                        <FormControl>
                            <InputLabel id="post-dropdwn-label">Posts</InputLabel>
                            <Select
                                labelId="post-dropdwn-select-label"
                                id="post-dropdwn-select"
                                value={this.state.postDropDwnSelection}
                                onChange={(event) => this.handlePostDropDwnChange(event)}
                            >
                                <MenuItem value='all'>All</MenuItem>
                                <MenuItem value='user'>User Posts</MenuItem>
                            </Select>
                        </FormControl>
                        {/* <button className={classes.floatingBtn}>
                            <span className="material-icons text-white text-center">create</span>
                        </button> */}
                    </div>
                </div>
                {
                    this.state.posts.length > 0 ? this.state.posts.map((postItem, index) => {
                        let key = 'post-' + index;
                        return (
                            <Tweet key={key} post={postItem} idx={index} handleLike={this.handleLike}
                                replies={postItem.replies !== undefined && postItem.replies !== null ? postItem.replies : []}
                                handleReplyLike={this.handleReplyLike} postReply={this.postReply}
                                loggedInUsername={this.state.username} handleDelete={this.handleDelete}
                                updatePost={this.updatePost} />
                        )
                    }) :
                        (
                            <div className="mt-3">
                                <NoResults message="No posts found" />
                            </div>
                        )
                }
                { }
                <div className="row mb-4"></div>
            </Aux>
        );
    }
}

export default Home;