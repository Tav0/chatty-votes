import React from 'react';
import { Button, ButtonToolbar, Form } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import { Field } from 'redux-form';
import connectedForm from './connectedForm';
import LabeledFormField from './LabeledFormField';
import MultiEntryField from './MultiEntryField';
import config from '../../config/'

class CreateQuestionForm extends React.Component {
    static propTypes = {
        ...reduxFormPropTypes,
        onSubmit: React.PropTypes.func.isRequired,
        autherror : React.PropTypes.object
    }

    render() {
    // remove the eslint suppressions when you start developing.
        const {
            onSubmit,     // submission callback provided by parent component
            handleSubmit, // provided by redux-form, read http://redux-form.com/6.1.1/docs/api/Props.md/ 
                    // if we used 'handleSubmit' instead of 'handleSubmit(onSubmit)' it would call
                    // this.props.onSubmit implicitly.  We use onSubmit for clarity.
            valid
        } = this.props;

        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <LabeledFormField name="question" label={'Question'} />
                <LabeledFormField name="description" label={'Description'}
                    componentClass="textarea" componentProps={{rows: "10"}} />
                <Field name="choices"
                    component={MultiEntryField}
                    entryLabel={(idx) => `Choice ${idx+1}`}
                    addButtonLabel="Add a new choice"
                    newEntryDefault="Enter Choice" />
                <ButtonToolbar>
                <Button
                    disabled={!valid}
                    type='submit'
                    bsStyle='success'>
                    Submit
                </Button>
                <LinkContainer to={config.publicUrl + '/'}>
                    <Button>Cancel</Button>
                </LinkContainer>
                </ButtonToolbar>
            </Form>
        );
    }
}

const validate = (values) => {
    const errors = {}
    if (!values.question) {
        errors.question = "Enter a question"
    }
    if (!values.description) {
        errors.description = "Enter a description"
    }
    return errors;
}

function mapStateToProps(state) {
    return {};
}

export default connectedForm({
    form: 'newquestion',
    validate,
}, mapStateToProps)(CreateQuestionForm);
