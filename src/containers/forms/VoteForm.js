import React from 'react';
import { Alert, Button, ButtonToolbar, Form, FormGroup } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import connectedForm from './connectedForm';
import config from '../../config/'
import RadioGroup from './RadioGroup';
import { isLoading, isError } from '../../util/loadingObject';

class VoteForm extends React.Component {
    static propTypes = {
        ...reduxFormPropTypes,
        onSubmit: React.PropTypes.func.isRequired,
        autherror : React.PropTypes.object
    }

    render() {
        const {
            onSubmit,
            handleSubmit,
            valid,
            alternatives,
            description,
            vote,
            initialValues,
            loadingStatus
        } = this.props;
        console.log(this.props);

        if (isLoading(this.props.loadingStatus)) return (<p>Loading...</p>);
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                {this.props.description}
                <RadioGroup name='vote' choices={this.props.alternatives} value={this.props.vote} />
                
                { this.props.submitSucceeded &&
                    <FormGroup>
                        <Alert bsStyle='success'>
                            'Vote Registered!'
                        </Alert>
                    </FormGroup>
                }

                
                { this.props.submitFailed &&
                    <FormGroup>
                        <Alert bsStyle='danger'>
                            'Vote was not submitted. Try again later.'
                        </Alert>
                    </FormGroup>
                }
                
                <ButtonToolbar>
                <Button
                    disabled={!valid}
                    type='submit'
                    bsStyle='success'>
                    Submit
                </Button>
                <LinkContainer to={config.publicUrl + '/questions'}>
                        <Button>Cancel</Button>
                </LinkContainer>
                </ButtonToolbar>
            </Form>
        );
    }
}

//function mapStateToProps(state) {
//    console.log(state.survey)
//    return {
//        vote: String(state.survey.current.vote[0]),
//        initialValues: String(state.survey.current.vote[0])
//    }
//}

export default connectedForm({
    form: 'singlevote',
})(VoteForm);
