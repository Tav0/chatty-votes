import React from 'react';
import { connect } from 'react-redux';
import {Panel, Row, Col, Alert} from 'react-bootstrap';
import CreateQuestionForm from '../containers/forms/CreateQuestionForm';
import {editquestion, getquestion} from '../actions/questions.js';
import { isLoading, isError } from '../util/loadingObject';


class EditQuestionPage extends React.Component {
    static contextTypes = {
        history: React.PropTypes.object.isRequired
    }


    doEdit(questionn) {
        console.log(this.props.current.question.id);
        this.props.dispatch(editquestion({qid: this.props.current.question.id, question: questionn.question, description: questionn.description, type: 1, choices: questionn.choices}));
    }

    fetchData(params) {
        this.props.dispatch(getquestion(params.qid));
    }

    componentWillMount() {
        this.fetchData(this.props.params);
    }

    render() {
        const current = this.props.current;

        if (isLoading(current)) return (<p>Loading...</p>);
        if (isError(current)) return (<Alert bsStyle='danger'>{current.error.response.statusText}</Alert>);

        console.log(current);
        let newChoices = [];
        for (let choice of current.question.choices) {
            newChoices.push(choice.description);
        }
        const ivs = {question: current.question.question, description: current.question.description, choices: newChoices}
        return (
            <Row>
                <Col xsOffset={0} xs={10} smOffset={4} sm={4}>
                    <Panel header={<h1>Edit question #{current.question.id}</h1>} >
                        <CreateQuestionForm
                            onSubmit={v => this.doEdit(v)}
                            initialValues={ivs} />
                    </Panel>
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state) {
    if(Object.keys(state.survey).length > 3) {
       state.survey.loadingStatus = 'ok'
    } 

    return {
        current: state.survey
    };
}

export default connect(mapStateToProps)(EditQuestionPage);
