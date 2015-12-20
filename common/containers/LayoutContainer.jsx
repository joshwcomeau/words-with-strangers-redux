import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Layout                 from '../components/layout/Layout.jsx';
import * as authActions       from '../actions/auth.actions';
import * as uiActions         from '../actions/ui.actions';

function mapStateToProps(state) {
  return state.toJS();
}

function mapDispatchToProps(dispatch) {
  const actionCreators = _.extend({}, authActions, uiActions);
  return bindActionCreators(actionCreators, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( Game );
