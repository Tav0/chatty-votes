import React from 'react';
import { connect } from 'react-redux';
import TopNavBar from '../components/TopNavBar';
import config from '../config/';

/** AppContainer renders the navigation bar on top and its
 * children in the main part of the page.  Its children will
 * be chosen based on the selected route.
 */
class AppContainer extends React.Component {
  render() {
    return (
      <div>
          <TopNavBar branding="Cloud App"
                     menus={config.menus} 
                     user={this.props.user} 
                     loginUrl={`${config.publicUrl}/login`}
                     logoutUrl={`${config.publicUrl}/logout`}
            />
          <div className="container-fluid marketing">
            {this.props.children}
          </div>
      </div>
    );
  }
}

// https://github.com/ReactTraining/react-router/issues/975
AppContainer.contextTypes = {
    router: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    user: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
