import React from 'react';
import { Alert, Button, ButtonToolbar, Form, FormGroup } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import { reduxForm } from 'redux-form';
import LabeledFormField from './LabeledFormField';
import config from '../../config/'

/*
 * This form (for now at least) doubles as registration and profile
 * update form.
 */
class RegisterForm extends React.Component {
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
      register,
      valid,
      autherror
    } = this.props;


    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <LabeledFormField name="username" label={'User Name'} />
        <LabeledFormField name="password" label={'Password'} type="password" />
        <LabeledFormField name="confpassword" label={'Confirm Password'} type="password" />
        <LabeledFormField name="firstname" label={'First Name'} />
        
        <LabeledFormField name="lastname" label={'Last Name'} />

        <LabeledFormField name="email" label={'Email address'} />

        { autherror &&
            <FormGroup>
                <Alert bsStyle='danger'>
                    {autherror.response.body.message}
                </Alert>
            </FormGroup>
        }

        { register.loadingStatus === 'ok' &&
            <FormGroup>
                <Alert bsStyle='success'>
                    'Registration Successful'
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
    if (!values.username) {
        errors.username = "Enter a username"
    } 
    if (!values.password || values.password.length < 6) {
        errors.password = "Password must be at least 6 letters"
    }
    if (values.password !== values.confpassword) {
        errors.confpassword = "Passwords must equal each other"
    }
    if (!values.firstname) {
        errors.firstname = "Must enter a first name"
    }
    if (!values.lastname) {
        errors.lastname = "Must enter a last name"
    }
    if (!values.email) {
        errors.email = "Must enter an email"
    }
      return errors
}

//function mapStateToProps(state) {
//  return {
//    autherror: state.auth.register.error,
//    initialValues: state.auth,
//    register: state.auth.register
//  };
//}

export default reduxForm({
  form: 'register',
  validate
})(RegisterForm);

