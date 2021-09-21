import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import Aux from '../../../hoc/Auxillary';
import classes from './SideDrawer.module.css';

class SideDrawer extends Component {

    render() {
        return (
            <SwipeableDrawer
                anchor='right'
                open={this.props.showDrawer}
                onClose={() => this.props.toggleDrawer(false)}
                onOpen={() => this.props.toggleDrawer(true)}>
                <div
                    className={classes['drawer-width']}
                    role="presentation"
                    onClick={() => this.props.toggleDrawer(false)}
                    onKeyDown={() => this.props.toggleDrawer(false)}
                >
                    {this.props.links.map((linkItems, listIndex) => {
                        return (
                            <Aux key={listIndex}>
                                <List>
                                    {linkItems.map((link, eleIndex) => {
                                        return (
                                            <ListItem className="font" button key={eleIndex} onClick={() => this.props.routingHandler(link.to)}>
                                                {link.text}
                                            </ListItem>
                                        )
                                    })}
                                </List>
                                {this.props.links.length > 1 && (listIndex!==(this.props.links.length-1)) ? <Divider /> : null}
                            </Aux>
                        )
                    })}
                </div>
            </SwipeableDrawer>
        )
    }
}

export default SideDrawer;