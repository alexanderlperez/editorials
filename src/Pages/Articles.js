import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import { Link } from 'react-router-dom'
import Share from '../Components/Share';

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

        fetch(CONFIG.api + '/articles/' + id, { method: 'COPY', body: { authorId: this.props.authorId } })
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

                        <ListGroup>
                            {this.state.articles.map((article, i) => (
                                <ListGroupItem key={i}>
                                    <ListGroupItemHeading>
                                        {article.title} 
                                        <Link to={"/article/view/" + article.id}>View</Link>
                                        <Link to={"/article/edit/" + article.id}>Edit</Link>
                                        <a href="" onClick={(e) => this.deleteArticle(e, article.id)}>Delete</a>
                                        <a href="" onClick={(e) => this.duplicateArticle(e, article.id)}>Duplicate</a>
                                        <Share articleId={article.id} authorId={this.props.authorId} />
                                    </ListGroupItemHeading>
                                    <ListGroupItemText>{article.body.slice(0, 80)}...</ListGroupItemText>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default Articles;
