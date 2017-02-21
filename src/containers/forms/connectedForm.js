/*
 * Higher-order component:
 * Takes regular redux component, returns one to which redux-form
 * options are applied.
 */
import { connect } from 'react-redux';
// documentation: http://redux-form.com/6.1.1/docs/api/ReduxForm.md/
import { reduxForm } from 'redux-form';

export default function(formOptions, mapStateToProps, mapDispatchToProps) {
  return form => {
    // as I discovered in https://github.com/erikras/redux-form/issues/2012
    return connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(form));
  };
}
