import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import CONFIG from '../config.json';

class Share extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            toUser: '',
            users: [],
        };

        this.toggle = this.toggle.bind(this);
        this.share = this.share.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch(CONFIG.api + '/users')
            .catch(error => console.error(error))
            .then(res => res.json())
            .then(users => this.setState({
                users,
                toUser: users[0].id
            }))
    }

    toggle(e) {
        // check since reused from non-event
        if (e) {
            e.preventDefault();
        }

        this.setState({
            modal: !this.state.modal
        });
    }

    handleChange(e) {
        this.setState({
            toUser: e.target.value
        })
    }

    share() {
        const config = { 
            method: 'POST', 
            cache: 'no-cache',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                articleId: this.props.articleId,
                authorId: this.props.authorId,
                userId: this.state.toUser
            }) 
        }; 

        fetch(CONFIG.api + '/shares/', config)
            .catch(error => console.error(error))
            .then(() => this.toggle())
    }

    render() {
        return (
            <React.Fragment>
                <a href="#" onClick={this.toggle}>Share</a>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Share to User</ModalHeader>
                    <ModalBody>
                        <select value={this.state.toUser} onChange={this.handleChange}>
                            {this.state.users.map((user, i) => 
                                <option key={i} value={user.id}>{user.first_name + ' ' + user.last_name}</option>
                            )}
                        </select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.share}>Share</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Share;
