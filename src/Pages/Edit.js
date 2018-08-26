import React, { Component } from 'react';
import { Button  } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import CONFIG from '../config.json';

class Edit extends Component {
    constructor(props) {
        super(props);

        const isNew = props.match.params.id == 'new'; // url -> /article/edit/new

        this.state = {
            isNew,
            loading: isNew ? false : true, // isNew, no need to be "Loading..."
            article: { authorId: this.props.authorId, title: '', body: '' }
        }

        this.handleSave = this.handleSave.bind(this);
        this.updateField = this.updateField.bind(this);
    }

    componentDidMount() {
        if(this.state.isNew) {
            // no need to load article
            return;
        }

        fetch(CONFIG.api + '/articles/' + this.props.match.params.id)
            .then(res => res.json())
            .then(article => this.setState({ 
                article,
                loading: false,
            }))
    }

    handleSave() {
        if (this.state.isNew) {
            this.createNewArticle();
        } else {
            this.updateArticle();
        }
    }

    createNewArticle() {
        fetch(CONFIG.api + '/articles', { 
            method: 'POST', 
            cache: 'no-cache',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state.article),
        })
            .then(res => res.json())
            .then(res => this.props.history.push(this.props.location.pathname.replace('new', res.id))) 
    }

    updateArticle() {
        fetch(CONFIG.api + '/articles', { 
            method: 'PATCH', 
            cache: 'no-cache',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state.article),
        })
    }

    updateField(e) {
        const elem = e.target;
        const article = {
            ...this.state.article,
            [elem.name]: elem.value
        }

        this.setState({article})
    }

    render() {
        if (this.state.loading) {
            return <h1>Loading...</h1>
        }
        
        return (
            <div className="Edit container">
                <div className="row">
                    <div className="col-8">
                        <div className="row">
                            <h1>Edit Article&nbsp; </h1>
                            <Button onClick={this.handleSave}>Save</Button>
                        </div>

                        <div className="row">
                            <input type="text" name="title" onChange={this.updateField} defaultValue={this.state.article.title} />
                            <textarea name="body" onChange={this.updateField} defaultValue={this.state.article.body} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Edit);


