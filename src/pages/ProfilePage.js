import React from 'react';
import { connect } from 'react-redux';
import {Panel, Row, Col} from 'react-bootstrap';
import ProfileForm from '../containers/forms/ProfileForm';
import {isLoading} from '../util/loadingObject';
import {updateProfile, getProfile} from '../actions/user.js';
import config from '../config/';

class ProfilePage extends React.Component {
    static contextTypes = {
        history: React.PropTypes.object.isRequired
    }
    
    static propTypes = {
        user : React.PropTypes.object
    }

    doUpdate(id, userobject) {
        this.props.dispatch(updateProfile(id, userobject, () => {
            console.log('here');
            this.props.dispatch(getProfile(id));
        }))
        //const newUser = this.props.dispatch(getProfile(id))
        //const user = this.props.user
        //user.firstname = newUser.firstname;
        //user.lastname = newUser.lastname;
        //user.email = newUser.email;
    }

    goNext() {
        const {next, ...query } = this.props.location.query;
        this.context.history.push({
            pathname: next || `${config.publicUrl}/`,
            query: query
        })
    }

    render() {
        const user = this.props.user
        return (
            <Row>
                <Col xsOffset={0} xs={10} smOffset={4} sm={4}>
                    <Panel header={<h1>Update Your Profile</h1>}>
                        <ProfileForm
                            loading={isLoading(user)}
                            autherror={user.updateProfile.error}
                            initialValues={user}
                            update={user.updateProfile}
                            onSubmit={v => this.doUpdate(user.id, v)} />
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

export default connect(mapStateToProps)(ProfilePage);

