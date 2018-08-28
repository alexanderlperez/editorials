import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import { Link } from 'react-router-dom'
import ArticlesList from '../Components/ArticlesList';

import CONFIG from '../config.json';

class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            articles: []
        }

        this.deleteArticle = this.deleteArticle.bind(this);
        this.duplicateArticle = this.duplicateArticle.bind(this);
    }

    componentDidMount() {
        fetch(CONFIG.api + '/articles')
            .catch(error => console.error(error))
            .then(res => res.json())
            .then(articles => this.setState({ 
                articles,
                loading: false,
            }))
    }

    deleteArticle(e, id) {
        e.preventDefault();

        // Surprise encounter:
        // mystery why 'self' is needed here in spite of fat-arrow syntax in fetch/Promise callback
        // ie. since 'this' is still the class instance reference, shouldn't the callback retain that...
        var self = this; 

        fetch(CONFIG.api + '/articles/' + id, { method: 'DELETE' })
            .catch(error => console.error(error))
            .then(() => {
                const idx = self.state.articles.findIndex(article => article.id === id)
                const articles = self.state.articles.slice(); 

                articles.splice(idx, 1)
                self.setState({articles})
            })
    }

    duplicateArticle(e, id) {
        e.preventDefault();

        // Surprise encounter:
        // mystery why 'self' is needed here in spite of fat-arrow syntax in fetch/Promise callback
        // ie. since 'this' is still the class instance reference, shouldn't the callback retain that...
        var self = this; 

        // Opted to duplicate articles using the current editor/authorId rather than the one set in the article, 
        // because Editors may want to use articles as templates rather than wholesale
        fetch(CONFIG.api + '/articles/' + id, { method: 'COPY', body: { authorId: this.props.authorId } })
            .catch(error => console.error(error))
            .then(() => {
                const articles = self.state.articles.slice();
                const idx = articles.findIndex(article => article.id === id)

                articles.push(articles[idx])
                self.setState({articles})
            })
    }

    render() {
        if (this.state.loading) {
            return <h1>Loading...</h1>
        }

        return (
            <div className="Articles container">
                <h1>Articles</h1> 
                <div className="row">
                    <div className="col">
                        <Link to="/article/edit/new" className="btn btn-primary">Create New Article</Link>
                        <ArticlesList articles={this.state.articles} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Articles;
