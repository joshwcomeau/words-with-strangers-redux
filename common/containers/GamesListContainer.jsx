import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import GamesList              from '../components/games_list/GamesList.jsx';
import * as GamesListActions  from '../actions/games_list.actions';

function mapStateToProps(state) {
  return state.get('gamesList').toJS();
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GamesListActions, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( GamesList );
