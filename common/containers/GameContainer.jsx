import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Game                   from '../components/game/Game.jsx';
import * as GameActions       from '../actions/game.actions';
import gameSelector           from '../selectors/game.selector';

function mapStateToProps(state) {
  return gameSelector(state.toJS());
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(GameActions, dispatch)
  };
}

export default connect( mapStateToProps, mapDispatchToProps )( Game );
