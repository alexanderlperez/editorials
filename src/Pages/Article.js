import React, { Component } from 'react';
import CONFIG from '../config.json';

class Article extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            article: {}
        }
    }

    componentDidMount() {
        fetch(CONFIG.api + '/articles/' + this.props.match.params.id)
            .catch(error => console.error(error))
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
            <div className="Article container">
                <div className="row">
                    <div className="col">
                        <h1 className="title">{this.state.article.title}</h1>

                        <p className="body">
                            {this.state.article.body}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Article;


