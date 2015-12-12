import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import TileRack               from '../components/TileRack';
import * as GameActions       from '../actions/game';

function mapStateToProps(state) {
  return {
    tiles: state.getIn(['game', 'rack', 'tiles'])
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GameActions, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( TileRack );
