import React, { Component } from 'react';
import { Badge, Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import SharesList from '../Components/SharesList.js';

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
                            <SharesList shares={this.state.shares} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
