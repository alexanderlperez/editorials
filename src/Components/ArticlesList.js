import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import { Link } from 'react-router-dom'
import Share from '../Components/Share';

class ArticlesList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListGroup className="ArticlesList">
                {this.props.articles.map((article, i) => (
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
        );
    }
}

export default ArticlesList;




