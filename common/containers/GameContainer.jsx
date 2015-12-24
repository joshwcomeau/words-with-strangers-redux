import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Game                   from '../components/game/Game.jsx';
import * as GameActions       from '../actions/game.actions';

function mapStateToProps(state) {
  return state.get('game').toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(GameActions, dispatch)
  };
}

export default connect( mapStateToProps, mapDispatchToProps )( Game );
