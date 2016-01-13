import _                  from 'lodash';
import React              from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { expect }         from 'chai';
import sinon              from 'sinon';

import Tile from '../../../common/components/game/Tile.jsx';
import Controls from '../../../common/components/game/Controls.jsx';

// Obtain the reference to the component before React DnD wrapping
const OriginalTile = Tile.DecoratedComponent.DecoratedComponent;
// Stub the React DnD connector functions with an identity function
const identity = el => el;

const shallowDOM = createRenderer();

describe('Tile', () => {
  describe('propTypes', () => {
    let consoleStub;

    before( () => {
      consoleStub = sinon.stub(console, 'error');
    })
    after( () => {
      // Remove the stub
      consoleStub.restore();
    });

    const exampleProps = {
      connectDragSource:  identity,
      connectDropTarget:  identity,
      isDragging:         false,
      isMyTurn:           false,
      tile: {
        letter: 'J',
        points: 2,
        belongsToCurrentUser: true
      }
    };
    let insufficientProps;

    it('throws without `connectDragSource`', () => {
      insufficientProps = _.omit(exampleProps, 'connectDragSource');
      shallowDOM.render(<OriginalTile {...insufficientProps} />);

      console.log(consoleStub.callCount);

      expect(consoleStub.calledOnce).to.equal(true);
      expect(consoleStub.calledWithExactly('lalala')).to.equal(true);
    })
  });
  xit('renders correctly', () => {
    shallowDOM.render(
      <OriginalTile

        connectDropTarget={identity}
        isMyTurn={false}
        tile={{
          letter: 'J',
          points: '2',
          belongsToCurrentUser: true
        }}
      />
    );

    const actualElement = shallowDOM.getRenderOutput();
    const expectedElement = (
      <div className="tile">
        <div className="tile-letter">J</div>
        <div className="tile-points">2</div>
      </div>
    );

    console.log(actualElement);

    expect(actualElement).to.equalJSX(expectedElement);
  });
});
