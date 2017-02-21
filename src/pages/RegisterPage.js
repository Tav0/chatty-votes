import React from 'react';
import { connect } from 'react-redux';
import {Panel, Row, Col} from 'react-bootstrap';
import RegisterForm from '../containers/forms/RegisterForm';
import { isLoading, isLoaded } from '../util/loadingObject';
import { register } from '../actions/user.js';
import config from '../config/';
class RegisterPage extends React.Component {
    static contextTypes = {
        history: React.PropTypes.object.isRequired
    }

  static propTypes = {
    user : React.PropTypes.object
  }

  // how to dispatch the action that registers the user
  doRegister(userobject) {
    this.props.dispatch(register(userobject))
  }
    
    goNext() {
        const {next, ...query } = this.props.location.query;
        this.context.histroy.push({
            pathname: next || `${config.publicUrl}/`,
            query: query
        })
    }

    componentWillReceiveProps(props) {
        if (isLoaded(props.user)) {
            this.goNext();
        }
    }

  render() {
    const user = this.props.user
    return (
        <Row>
            <Col xsOffset={0} xs={10} smOffset={4} sm={4}>
                <Panel header={<h1>Sign up</h1>} >
                    <RegisterForm
                        loading={isLoading(user)}
                        autherror={user.register.error}
                        initialValues={user}
                        register={user.register}
                        onSubmit={v => this.doRegister(v)} />
                </Panel>
            </Col>
        </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth
  };
}

export default connect(mapStateToProps)(RegisterPage);

