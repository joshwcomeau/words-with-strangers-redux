import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Register               from '../components/register/Register.jsx';
import * as authActions       from '../actions/auth.actions';

function mapStateToProps(state) {
  return state.get('auth').toJS();
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(authActions, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( Register );
