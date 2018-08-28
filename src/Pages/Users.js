import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import CONFIG from '../config.json';

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            users: []
        }
    }

    componentDidMount() {
        fetch(CONFIG.api + '/users')
            .catch(error => console.error(error))
            .then(res => res.json())
            .then(users => this.setState({ 
                users,
                loading: false,
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
                        <h1>Users</h1>
                        <ListGroup>
                            {this.state.users.map((user, i) => 
                                <ListGroupItem key={i}>{`${user.first_name} ${user.last_name}`}</ListGroupItem>
                            )}
                        </ListGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default Users;

