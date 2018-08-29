import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom'
import CONFIG from '../config.json';

class PublicArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            unauthorized: false,
            article: {}
        }
    }

    componentDidMount() {
        const publicArticleId = parseInt(this.props.match.params.id, 10)

        //1. Check If Public: check that there is a share for this
        fetch(CONFIG.api + '/articles/' + publicArticleId + "/shares")
            .catch(error => console.error(error))
            .then(res => res.json())
            .then(shares => {
                if (!shares.find(({articleId}) => articleId === publicArticleId)) {
                    this.setState({
                        loading: false,
                        unauthorized: true,
                    })
                    return;
                }

                //2. get article
                return fetch(CONFIG.api + '/articles/' + publicArticleId)
                    .catch(error => console.error(error))
                    .then(res => res.json())
                    .then(article => this.setState({ 
                        article,
                        loading: false,
                        unauthorized: false,
                    }))
            })
    }

    render() {
        if (this.state.loading) {
            return <h1>Loading...</h1>
        }

        return (
            <div className="PublicArticle container">
                <div className="row">
                    <div className="col">
                        {this.state.unauthorized 
                                ? <Redirect to="/404" />
                                : (
                                    <Fragment>
                                        <h1 className="title">{this.state.article.title}</h1>
                                        <p className="body">{this.state.article.body}</p>
                                    </Fragment>
                                )
                            }
                    </div>
                </div>
            </div>
        );
    }
}

export default PublicArticle;


