/**
 * A multi-entry form input component.
 * This component will render multiple 'FormControl' text input fields the user can 
 * edit.  Each field will have 'remove' button with an X to their right.
 * Below, an 'Add' button is placed to add an entry.
 *
 * The 'value' represented by this input control is an array of strings.
 *
 * http://redux-form.com/6.2.0/docs/faq/CustomComponent.md/
 * The technique used here is briefly discussed by erikras in
 *  https://github.com/erikras/redux-form/issues/277
 */
import React from 'react';
import { ControlLabel, Button, ButtonToolbar, 
         FormGroup, FormControl, Glyphicon, InputGroup
       } from 'react-bootstrap';

class MultiEntryField extends React.Component {
    // We trace the parent's props.input.value 
    // in the 'this.choices' property, converting "" to [] if required.
    constructor(props) {
        super(props);
        this.choices = props.input.value || [];
    }

    componentWillReceiveProps(nextProps) {
        this.choices = nextProps.input.value || [];
    }

    render () {
        const choices = this.choices;

        const addChoice = () => {
            this.props.input.onChange(choices.concat(this.props.newEntryDefault))
        }

        return (
          <div>
            {choices.map((c, idx) => {
              const removeChoice = (idx) => {
                const currentSansIndex = choices.slice(0, idx).concat(choices.slice(idx+1))
                this.props.input.onChange(currentSansIndex);
              }

              // We implement the 'FormControl' below using the controlled component technique
              // as per https://facebook.github.io/react/docs/forms.html#controlled-components
              //
              const update = (idx, nvalue) => {
                const newchoices = choices.concat();
                newchoices[idx] = nvalue;
                this.props.input.onChange(newchoices);
              }

              // Styling provided by 
              // https://react-bootstrap.github.io/components.html#forms-input-groups
              return (
                <FormGroup key={idx}>
                <ControlLabel>{this.props.entryLabel(idx)}</ControlLabel>
                  <InputGroup>
                    <FormControl 
                       value={choices[idx]}
                       onChange={(event) => update(idx, event.target.value)}>
                    </FormControl>
                    <InputGroup.Button>
                      <Button onClick={(event) => removeChoice(idx)} bsStyle="danger">
                        <Glyphicon glyph="remove" /> 
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </FormGroup>);
              })}
              <FormGroup>
                <ButtonToolbar>
                  <Button bsStyle='info' onClick={addChoice}> 
                    {this.props.addButtonLabel}
                  </Button> 
                </ButtonToolbar>
              </FormGroup>
          </div>);
    }
}

export default MultiEntryField;

// ---------
