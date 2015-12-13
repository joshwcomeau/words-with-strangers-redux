import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import TileRack               from '../components/TileRack.jsx';
import * as GameActions       from '../actions/game.actions';

function mapStateToProps(state) {
  return state.get('game').toJS();
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GameActions, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( TileRack );
