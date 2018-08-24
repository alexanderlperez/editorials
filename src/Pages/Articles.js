import React, { Component } from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import { Link } from 'react-router-dom'

import CONFIG from '../config.json';

class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            articles: []
        }
    }

    componentDidMount() {
        console.log(CONFIG.api);
        fetch(CONFIG.api + '/article')
            .then(res => res.json())
            .then(articles => this.setState({ 
                articles,
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
                        <h1>Articles</h1>

                        <ListGroup>
                            {this.state.articles.map((article, i) =>
                                (
                                    <ListGroupItem key={i}>
                                        <ListGroupItemHeading>
                                            {article.title} <Link to={"/article/" + article.id}>View</Link>
                                        </ListGroupItemHeading>
                                        <ListGroupItemText>{article.body.slice(0, 25)}...</ListGroupItemText>
                                    </ListGroupItem>
                                )
                            )}
                        </ListGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default Articles;
