// A monolithic object holding all publicly-available action creators.

import * as _ from 'lodash';

import * as auth        from './auth.actions';
import * as game        from './game.actions';
import * as gamesList   from './games_list.actions';
import * as ui          from './ui.actions';
import { pushPath }     from 'redux-simple-router';

const actionCreators = [ auth, game, gamesList, ui ];


// This is essentially just a fancy merge of all action creators.
// Doing it this way so that duplicates can be caught.
const actionCreatorIndex = actionCreators.reduce( (index, actionCreator) => {

  _.forEach(actionCreator, (creator, actionName) => {
    // By convention, constants are unique across actions.
    // No two sets of action creators can use the same constant.
    // To prevent accidental violation of this rule, we'll throw an exception
    // if multiples were found.
    if ( actionName in index ) {
      throw new Error(`Multiple action creators share the name ${actionName}. This isn't allowed! Please ensure action names are unique across all action creators.`)
    }

    index[actionName] = creator;
  });

  // Add in the redux-simple-router bindings, so we can dispatch PUSH_PATH
  // from the server.
  index.pushPath = pushPath

  return index;
}, {});


export default actionCreatorIndex;
