import React from 'react';
import { connect } from 'react-redux';

import { Alert, Table, Pager, Button, Glyphicon } from 'react-bootstrap';
import { isLoading, isError } from '../util/loadingObject';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import config from '../config';
import { listquestions, removeQuestion } from '../actions/questions.js';
import FixedPagerItem from '../util/fixPagerItem';


class ListQuestionsPage extends React.Component {
    static contextTypes = {
        history: React.PropTypes.object.isRequired
    }


    removeQuestion(qid) {
        this.props.dispatch(removeQuestion(qid, () => {
            const page = this.props.location.query.page || 0
            this.page = Number(page) 
            this.props.dispatch(listquestions({page: page}))
        }));
    }

    /* fetch user list, using the ?page= query param in URL */
    fetchData(location) {
        const page = location.query.page || 0;
        // implement me - fetch the actual data
        this.page = Number(page) 
        this.props.dispatch(listquestions({page: page}))
    }
    /* Component is about to display - fetch the data from the server */
    componentWillMount() {
        this.fetchData(this.props.location);
    }

/* Our props or state changed.  Our router has injected the 'location'
     * props. If it changed, refetch the data.
     */
    componentDidUpdate(prevProps, prevState) {
        if (this.props.location !== prevProps.location)
            this.fetchData(this.props.location);
    }
    hasPrevPage() {
        return this.page !== 0;
    }
    hasNextPage() {
        return this.props.surveylist.has_more;
    }

    // the URL of the next page, suitable for use in <Link> or <LinkContainer>
    nextPageUrl() {
        const loc = this.props.location
            const newQuery = { ...loc.query, page: this.page + 1 }
        return ({ pathname: loc.pathname, query: newQuery })
    }
    // go to next page
    nextPage() {
        this.context.history.push(this.nextPageUrl())
    }
    prevPageUrl() {
        const loc = this.props.location
            const newQuery = { ...loc.query, page: this.page - 1 }
        return ({ pathname: loc.pathname, query: newQuery })
    }
    prevPage() {
        this.context.history.push(this.prevPageUrl())
    }

    onRemoveClick(event) {
        this.removeQuestion(event.currentTarget.id);
    }

    
    render() {
        const questions = this.props.surveylist;

        if (isLoading(questions)) return (<p>Loading...</p>);
        if (isError(questions)) return (<Alert bsStyle='danger'>{questions.error.response.statusText}</Alert>);
        return (
            <div>
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>QID</th>
                        <th>Question</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.questions.map((question, i) => {
                        return (
                            <tr key={question.qid}>
                                <td><Link to={config.publicUrl + '/questions/' + question.qid}>{question.qid}</Link></td>
                                <td>{question.question}<br />{question.description}</td>
                                <td><LinkContainer to={config.publicUrl + `/questions/edit/${question.qid}`}>
                                    <Button bsSize="large" bsStyle="primary"><Glyphicon glyph="pencil" /></Button>
                                    </LinkContainer>
                                    <Button bsSize="large" bsStyle="danger" onClick={this.onRemoveClick.bind(this)} id={question.qid} ><Glyphicon glyph="trash" /></Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Pager>
                { this.hasPrevPage() &&
                    <LinkContainer to={this.prevPageUrl()}>
                        <FixedPagerItem previous>&lrr; Previous Page</FixedPagerItem>
                    </LinkContainer>
                }
                { this.hasNextPage() &&
                    <LinkContainer to={this.nextPageUrl()}>
                        <FixedPagerItem next> Next Page &rarr;</FixedPagerItem>
                    </LinkContainer>
                }
            </Pager>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        surveylist: state.surveylist
    };
}

export default connect(mapStateToProps)(ListQuestionsPage);
