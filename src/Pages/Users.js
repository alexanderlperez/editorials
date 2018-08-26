import React, { Component } from 'react';
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
        console.log(CONFIG.api);
        fetch(CONFIG.api + '/users')
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
                        <ul>
                            {this.state.users.map((user, i) => <li key={i}>{`${user.first_name} ${user.last_name}`}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Users;

