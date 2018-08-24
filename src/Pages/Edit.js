import React, { Component } from 'react';
import { Button  } from 'reactstrap';
import CONFIG from '../config.json';

class Edit extends Component {
    constructor(props) {
        super(props);

        const isNew = props.match.params.id == 'new';

        this.state = {
            isNew,
            loading: isNew ? false : true,
            article: { title: '', body: '' }
        }
    }

    componentDidMount() {
        if(this.state.isNew) {
            this.set
            return;
        }

        fetch(CONFIG.api + '/article/' + this.props.match.params.id)
            .then(res => res.json())
            .then(article => this.setState({ 
                article,
                loading: false,
            }))
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
                            <Button>Save</Button>
                        </div>

                        <div className="row">
                            <input type="text" defaultValue={this.state.article.title} />
                            <textarea defaultValue={this.state.article.body} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Edit;


