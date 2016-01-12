import React              from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { expect }         from 'chai';

import Tile from '../../../common/components/game/Tile.jsx';
import Controls from '../../../common/components/game/Controls.jsx';

describe('Tile', () => {
  it('works', () => {
    // Obtain the reference to the component before React DnD wrapping
    const OriginalTile = Tile.DecoratedComponent.DecoratedComponent;
    // Stub the React DnD connector functions with an identity function
    const identity = el => el;

    const renderer = createRenderer();
    renderer.render(
      <OriginalTile
        connectDragSource={identity}
        connectDropTarget={identity}
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

    expect(actualElement).to.deep.equal(expectedElement);
  });
});
