/**
 * A 'dumb' React component that draws a box consisting of
 * single-choice radio buttons with a label.  Intended for
 * inclusion in a redux-form connected form.
 *
 * Use like so:
 *
 * <RadioGroup name="desiredname" choices={choices} />
 *
 * where choices is an array [{description: ..., value: ...}, ....]
 *
 * describing the descriptions that should be displayed and the actual
 * value. Make sure that the type of the initial value and
 * the type of the 'value' fields match (checked is set using ===).
 * Also, all 'value' fields must be different.
 */
import React from 'react';

import { Radio, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Field } from 'redux-form';

const radioButtonMaker = props => 
{
   return (<ListGroup> 
      {props.choices.map((c) => (
         <ListGroupItem key={c.value}>
          <Radio name={props.name} value={c.value} onChange={props.input.onChange} 
                 checked={c.value === props.input.value}>
            {c.description}
          </Radio>
         </ListGroupItem>
          ))}
   </ListGroup>);
}

export default (props) => (
   <Field name={props.name} component={radioButtonMaker} choices={props.choices} />
);

