import React, { Component } from 'react';
import { Badge, Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import CONFIG from '../config.json';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListGroup className="SharesList">
                {this.props.shares.map((share, i) => (
                    <ListGroupItem key={i}>
                        <span className="date">{new Date(share.created).toLocaleString()}</span>
                        <span>
                            {share.accessed 
                                    ? <Badge pill color="success">&#x2714; Read</Badge>
                                    : <Badge pill color="secondary">Pending</Badge>}
                                </span>
                                <span>{share.first_name + " " + share.last_name}</span>
                                <span>{share.title}</span>
                            </ListGroupItem>
                ))}
            </ListGroup>
        );
    }
}

export default Home;

