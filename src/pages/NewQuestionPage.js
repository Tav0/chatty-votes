import React from 'react';
import { connect } from 'react-redux';
import {Panel, Row, Col} from 'react-bootstrap';
import CreateQuestionForm from '../containers/forms/CreateQuestionForm';
import {createQuestion} from '../actions/questions.js';

class CreateQuestionPage extends React.Component {
    static contextTypes = {
        history: React.PropTypes.object.isRequired
    }


    doCreate(questionn) {
        console.log(questionn);
        this.props.dispatch(createQuestion({question:questionn.question, description: questionn.description, choices: questionn.choices}));
    }

    render() {
        return (
            <Row>
                <Col xsOffset={0} xs={10} smOffset={4} sm={4}>
                    <Panel header={<h1>Add a new question</h1>} >
                        <CreateQuestionForm
                            onSubmit={v => this.doCreate(v)} />
                    </Panel>
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps)(CreateQuestionPage);
