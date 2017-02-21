import React from 'react';
import { ControlLabel, HelpBlock, FormControl, FormGroup } from 'react-bootstrap';
import { Field } from 'redux-form';

/* 
 * Helper methods to deal with redux-form.
 * To bind a form field to a redux-store, we must use 'Field'.
 * Field is brittle and must be used with a const fieldMaker function
 * in its component prop.
 */
// as per http://redux-form.com/6.1.1/docs/MigrationGuide.md/
// https://github.com/erikras/redux-form/issues/1557
// make sure to look at 6.1.1 release notes and not earlier.
// this function must be defined only once.
// Create a Bootstrap FormControl with a HelpBlock for errors.
const fieldMaker = field =>
    <div>
        <FormControl {...field.input} type={field.type} {...field.additionalProps}
        componentClass={field.componentClass || "input"} />
        {field.meta.touched &&
        field.meta.error &&
        <HelpBlock className="error">{field.meta.error}</HelpBlock>}
    </div>
// helper component that creates a FormGroup with a ControlLabel
const LabeledFormField = props =>
    <FormGroup>
        <ControlLabel>{props.label}</ControlLabel>
        <Field name={props.name} component={fieldMaker}
            additionalProps={props.componentProps}
            componentClass={props.componentClass}
            type={props.type || "text"} />
    </FormGroup>

export default LabeledFormField;

