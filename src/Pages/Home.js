import React, { Component } from 'react';
import { Badge, Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import CONFIG from '../config.json';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            shares: []
        }
    }

    componentDidMount() {
        fetch(CONFIG.api + "/users/" + this.props.authorId + "/shares")
            .catch(error => console.error(error))
            .then(res => res.json())
            .then(shares => this.setState({
                loading: false,
                shares
            }))
    }

    render() {
        if (this.state.loading) {
            return <h1>Loading...</h1>
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Noom Editorials CMS</h1>

                        <div className="Shares">
                            <h2>Shares</h2>

                            <ListGroup>
                                {this.state.shares.map((share, i) => (
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
