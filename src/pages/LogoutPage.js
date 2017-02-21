import React from 'react';
import { logout } from '../api/auth.js';
import config from '../config/';

class LogoutPage extends React.Component {
    render() {
        // Setting location.href does a (hard) reload, which refetches the
        // entire app from the server and navigates to /.
        // This will guarantee a blank slate, at the cost of a page reload.
        // (Alternatively, we can make logout an API action and augment
        // to auth reducer to handle successful logouts.)
        //
        logout().then(() => { location.href = `${config.publicUrl}/` })
        return <p>Logging you out...</p>
    }
}

export default LogoutPage;
