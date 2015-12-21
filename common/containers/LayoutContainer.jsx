import * as _                 from 'lodash';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Layout                 from '../components/layout/index.jsx';
import * as authActions       from '../actions/auth.actions';
import * as uiActions         from '../actions/ui.actions';

function mapStateToProps(state) {
  console.log(state);
  return state.toJS();
}

function mapDispatchToProps(dispatch) {
  const actionCreators = _.extend({}, authActions, uiActions);
  return bindActionCreators(actionCreators, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( Layout );
