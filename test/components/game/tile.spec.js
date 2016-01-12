import React              from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { expect }         from 'chai';

import Tile from '../../../common/components/game/Tile.jsx';
import Controls from '../../../common/components/game/Controls.jsx';

// Obtain the reference to the component before React DnD wrapping
const OriginalTile = Tile.DecoratedComponent.DecoratedComponent;
// Stub the React DnD connector functions with an identity function
const identity = el => el;

describe('Tile', () => {
  xit('validates propTypes', () => {
    // TODO
    // Use sinon to stub console warnings
    // http://stackoverflow.com/questions/26124914/how-to-test-react-proptypes-through-jest
  });

  it('renders correctly', () => {


    const renderer = createRenderer();
    renderer.render(
      <OriginalTile
        connectDragSource={identity}
        isMyTurn={false}
        tile={{
          letter: 'J',
          points: '2',
          belongsToCurrentUser: true
        }}
      />
    );

    const actualElement = renderer.getRenderOutput();
    const expectedElement = (
      <div className="tile">
        <div className="tile-letter">J</div>
        <div className="tile-points">2</div>
      </div>
    );

    expect(actualElement).to.equalJSX(expectedElement);
  });
});
