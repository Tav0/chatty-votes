import React from 'react';
import { Nav, NavDropdown, Navbar, NavItem, MenuItem } from 'react-bootstrap';

// IndexLinkContainer ensures that's active only if route matches.
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import { isLoaded } from '../util/loadingObject'

/* A helper component to render an array of dropdowns inside a <Nav> element 
 * Specify 'pullRight' true/false 
 */
const DropDowns = (props) => {
    const user = props.user 

    return (<Nav pullRight={props.pullRight} >
      {props.dropdowns.map((dropdown) =>
         (!(dropdown.onlyifauthenticated || dropdown.onlyifadmin)
          || (isLoaded(user) &&
                (
                    (dropdown.onlyifauthenticated && !dropdown.onlyifadmin)
                 || (dropdown.onlyifadmin && user.admin)
                )
             )
         ) &&
         <NavDropdown key={dropdown.label} title={dropdown.label}
            /* for https://github.com/react-bootstrap/react-bootstrap/issues/1426 */
            id={"dropdown-"+dropdown.label}>
            {dropdown.entries.map((item) =>
                <LinkContainer to={item.path} key={item.path}>
                    <MenuItem>
                        {item.label}
                    </MenuItem>
                </LinkContainer>
            )}
         </NavDropdown>
      )}
    </Nav>)
}

/**
 * Navigation bar component
 */
class NavBar extends React.Component {
    static propTypes = {
        menus: React.PropTypes.object,
        user: React.PropTypes.object,
        branding: React.PropTypes.string,
    }

    render() {
        const menus = this.props.menus
        const user = this.props.user
        return (
          <Navbar className="navbar-inverse navbar-static-top">
            <Navbar.Header>
              <Navbar.Brand>
                {this.props.branding}
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
            <Nav>
              {menus.topbar.map((item) =>
                 <IndexLinkContainer key={item.path} to={item.path}>
                   <NavItem>
                        {item.label}
                   </NavItem>
                 </IndexLinkContainer>
              )}
            </Nav>

            <Nav pullRight>
              {isLoaded(user) ?
                <LinkContainer to={this.props.logoutUrl}>
                    <NavItem>Logout ({user.email})</NavItem>
                </LinkContainer>
              :
                <LinkContainer to={this.props.loginUrl}>
                    <NavItem>Login</NavItem>
                </LinkContainer>
              } 
            </Nav>

            { menus.leftdropdowns &&
              <DropDowns dropdowns={menus.leftdropdowns} user={user} />
            }
            { menus.rightdropdowns &&
              <DropDowns pullRight={true} dropdowns={menus.rightdropdowns} user={user} />
            }

          </Navbar.Collapse>
        </Navbar>);
    }
}

export default NavBar;
