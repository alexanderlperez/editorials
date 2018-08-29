import React, { Component } from 'react';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText  } from 'reactstrap';
import { Link } from 'react-router-dom'
import Share from '../Components/Share';

class ArticleListing extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { article, authorId, deleteHandler, duplicateHandler } = this.props;

        return (
            <ListGroupItem>
                <ListGroupItemHeading>
                    {this.props.article.title} 
                    <Link to={"/article/view/" + article.id}>View</Link>
                    <Link to={"/article/edit/" + article.id}>Edit</Link>

                    <a href="" onClick={(e) => deleteHandler(e, article.id)}>Delete</a>
                    <a href="" onClick={(e) => duplicateHandler(e, article.id)}>Duplicate</a>

                    <Share articleId={article.id} authorId={authorId} />
                </ListGroupItemHeading>
                <ListGroupItemText>{article.body.slice(0, 80)}...</ListGroupItemText>
            </ListGroupItem>
        );
    }
}

export default ArticleListing;

