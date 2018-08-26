import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import { Link } from 'react-router-dom'

import CONFIG from '../config.json';

class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            articles: []
        }

        this.deleteArticle = this.deleteArticle.bind(this);
    }

    componentDidMount() {
        fetch(CONFIG.api + '/articles')
            .then(res => res.json())
            .then(articles => this.setState({ 
                articles,
                loading: false,
            }))
    }

    deleteArticle(id) {
        return () => {
            var self = this; 
            fetch(CONFIG.api + '/articles/' + id, { method: 'DELETE' })
                .then(() => {
                    // mystery why 'self' is needed here in spite of fat-arrow syntax 
                    const idx = self.state.articles.findIndex(article => article.id === id)
                    const articles = self.state.articles.slice(); 

                    articles.splice(idx, 1)
                    self.setState({articles})
                })
        }
    }

    render() {
        if (this.state.loading) {
            return <h1>Loading...</h1>
        }

        return (
            <div className="container">
                <h1>Articles</h1> 
                <div className="row">
                    <div className="col">
                        <Link to="/article/edit/new">Create New Article</Link>
                        <ListGroup>
                            {this.state.articles.map((article, i) => (
                                <ListGroupItem key={i}>
                                    <ListGroupItemHeading>
                                        {article.title} 
                                        <Link to={"/article/" + article.id}>View</Link>
                                        <Link to={"/article/edit/" + article.id}>Edit</Link>
                                        <Button color="link" onClick={this.deleteArticle(article.id)}>Delete</Button>
                                    </ListGroupItemHeading>
                                    <ListGroupItemText>{article.body.slice(0, 25)}...</ListGroupItemText>
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
