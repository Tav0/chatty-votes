import React from 'react';
import { connect } from 'react-redux';

import { Panel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { login } from '../actions/auth.js';
import config from '../config/';
import { isLoading, isLoaded } from '../util/loadingObject'
import LoginForm from '../containers/forms/LoginForm';

class LoginPage extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    router: React.PropTypes.object
  }

  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  /* 
   * The login page may be visited using URLs such as
   * /login?next=%2Fprofile - for instance, if the onEnter method
   * for pages that require authentication redirects here.
   * Upon successful login, we navigate there.
   */
  goNext() {
    const { next, ...query } = this.props.location.query;
    this.context.router.push({
      pathname: next || `${config.publicUrl}/`,
      query: query
    })
  }

  /* Check if login is still necessary. If not, navigate to next. */
  componentWillReceiveProps(props) {
    if (isLoaded(props.user)) {
      this.goNext();
    }
  }

  doLogin({username, password}) {
    this.props.dispatch(login(username, password));
  }

  render() {
    const user = this.props.user
    return (
      <Row>
        <Col xsOffset={0} xs={10} smOffset={4} sm={4}>
          <Panel header={<h1>Please log in</h1>} >
            <LoginForm
                loading={isLoading(user)}
                autherror={user.error}
                onSubmit={v => this.doLogin(v)} />
          </Panel>
          <div className="text-center">
              Don't have an account?
              <Link to={config.publicUrl + '/register'}> Sign up</Link> for one.
          </div>
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

export default connect(mapStateToProps)(LoginPage);

