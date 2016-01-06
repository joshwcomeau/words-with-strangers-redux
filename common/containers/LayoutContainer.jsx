import * as _                 from 'lodash';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Layout                 from '../components/layout';
import * as AuthActions       from '../actions/auth.actions';
import * as UiActions         from '../actions/ui.actions';

function mapStateToProps(state) {
  return state.toJS();
}

function mapDispatchToProps(dispatch) {
  const actionCreators = _.extend({}, AuthActions, UiActions);
  return bindActionCreators(actionCreators, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( Layout );
