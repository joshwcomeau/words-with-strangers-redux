import _                      from 'lodash';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import GamesList              from '../components/games_list/GamesList.jsx';
import * as GamesListActions  from '../actions/games_list.actions';

function mapStateToProps(state) {
  return _.pick(state.toJS(), ['gamesList', 'auth']);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(GamesListActions, dispatch)
  };
}

export default connect( mapStateToProps, mapDispatchToProps )( GamesList );
