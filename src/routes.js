import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';

import LoginPage from './pages/LoginPage';
import NewQuestionPage from './pages/NewQuestionPage';
import QuestionPage from './pages/QuestionPage';
import EditQuestionPage from './pages/EditQuestionPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ListUsersPage from './pages/ListUsersPage';
import ListQuestionsPage from './pages/ListQuestionsPage';
import HomePage from './pages/HomePage';
import AppContainer from './containers/AppContainer';

import { checkAuth } from './util/checkAuth';
import config from './config/';

const routes = (
  <Router history={browserHistory}>
    <Route path={`${config.publicUrl}/`} component={AppContainer}>
      <IndexRoute component={HomePage} />
      <Route path={`${config.publicUrl}/login`} component={LoginPage} />
      <Route path={`${config.publicUrl}/questions/edit/:qid`} component={EditQuestionPage} />
      <Route path={`${config.publicUrl}/questions/:qid`} component={QuestionPage} />
      <Route path={`${config.publicUrl}/newquestion`} component={NewQuestionPage} />
      <Route path={`${config.publicUrl}/questions`} component={ListQuestionsPage} onEnter={checkAuth} />
      <Route path={`${config.publicUrl}/logout`} component={LogoutPage} />
      <Route path={`${config.publicUrl}/register`} component={RegisterPage} />
      <Route path={`${config.publicUrl}/profile`} component={ProfilePage} onEnter={checkAuth} />
      <Route path={`${config.publicUrl}/listusers`} component={ListUsersPage} onEnter={checkAuth} />
      <Route path={`*`} component={NotFoundPage} />
    </Route>
  </Router>
);

export default routes;
