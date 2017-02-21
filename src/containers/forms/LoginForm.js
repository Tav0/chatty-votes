import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Alert, Button, ButtonToolbar, 
         Form, FormGroup } from 'react-bootstrap';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import { reduxForm } from 'redux-form'
import LabeledFormField from './LabeledFormField';

/*
 * This is a connected form that display username/password.
 * When the user hits submit, the 'onSubmit' method is called
 * in the parent, which receives the username/password the user
 * entered.  It also performs validation.
 */
class LoginForm extends React.Component {
  static propTypes = {
    ...reduxFormPropTypes,
    onSubmit : React.PropTypes.func.isRequired,
    autherror : React.PropTypes.object
  }

  render() {
    const {
      onSubmit,     // submission callback provided by parent component
      handleSubmit, // provided by redux-form, read http://redux-form.com/6.1.1/docs/api/Props.md/ 
                    // if we used 'handleSubmit' instead of 'handleSubmit(onSubmit)' it would call
                    // this.props.onSubmit implicitly.  We use onSubmit for clarity.
      valid,         // comes from redux-form
      autherror     // authentication error, from parent
    } = this.props;

    // use this to examine all props redux-form merges into props
    // console.dir(this.props);

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
         <LabeledFormField name="username" label={'User Name'} />
         <LabeledFormField name="password" label={'Password'} type="password" />

         { autherror && 
             <FormGroup>
                <Alert bsStyle='danger'>
                  Login failed
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
            <LinkContainer to={'/'}>
              <Button>Cancel</Button>
            </LinkContainer>
         </ButtonToolbar>
      </Form>
    );
  }
}

// validator as per
// http://redux-form.com/6.1.1/examples/syncValidation/
const validate = values => {
    const errors = {}
    //console.log(`Validating login form:`);
    //console.dir(values);
    if (!values.username || values.username.length === 0) {
        errors.username = "Username may not be empty"
    }
    if (!values.password || values.password.length === 0) {
        errors.password = "Password may not be empty"
    }
    return errors
}


export default reduxForm({
  form: 'login',
  touchOnChange: false, // these are the defaults, set true to enable validation on change
  touchOnBlur: true,    // these are the defaults, set false to disable validation on blur
  validate              // defined above
})(LoginForm);

