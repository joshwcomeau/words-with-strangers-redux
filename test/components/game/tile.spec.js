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

    before( () => consoleStub = sinon.stub(console, 'error') );
    afterEach( () => consoleStub.reset() );
    after( () => consoleStub.restore() );

    const exampleProps = {
      connectDragSource:  identity,
      connectDropTarget:  identity,
      isDragging:         false,
      isOver:             false,
      isMyTurn:           false,
      tile: {
        letter: 'J',
        points: 2,
        belongsToCurrentUser: true
      }
    };
    let insufficientProps, errorRegex;

    // Iterate through all top-level props, checking to see if it warns when
    // one is missing
    _.keys(exampleProps).forEach( prop => {
      // Don't test `tile`. It's complicated, and will be tested separately.
      if ( prop === 'tile' ) return

      it(`throws without '${prop}'`, () => {
        insufficientProps = _.omit(exampleProps, prop);
        shallowDOM.render(<OriginalTile {...insufficientProps} />);
        errorRegex = new RegExp(`Required prop \`${prop}\` was not specified`);

        expect(consoleStub.calledOnce).to.equal(true);
        expect(consoleStub.calledWithMatch(errorRegex)).to.equal(true);
      });
    });

    it("requires tiles to have a 'letter' prop", () => {
      insufficientProps = _.cloneDeep(exampleProps);
      insufficientProps.tile = _.omit(insufficientProps.tile, 'letter');

      console.log("INSUFF", insufficientProps)

      shallowDOM.render(<OriginalTile {...insufficientProps} />);
      errorRegex = new RegExp('Required prop `tile.letter` was not specified');

      console.log("let args", consoleStub.callCount, consoleStub.args);
      expect(consoleStub.calledOnce).to.equal(true);
      expect(consoleStub.calledWithMatch(errorRegex)).to.equal(true);
    });

    it("requires tiles to have a 'points' prop", () => {
      insufficientProps = _.cloneDeep(exampleProps);
      insufficientProps.tile = _.omit(insufficientProps.tile, 'points');

      console.log("INSUFF", insufficientProps)

      shallowDOM.render(<OriginalTile {...insufficientProps} />);
      errorRegex = new RegExp('Required prop `tile.points` was not specified');

      console.log("let args", consoleStub.callCount, consoleStub.args);
      expect(consoleStub.calledOnce).to.equal(true);
      expect(consoleStub.calledWithMatch(errorRegex)).to.equal(true);
    });

    it("requires tiles to have a 'belongsToCurrentUser' prop", () => {
      insufficientProps = _.cloneDeep(exampleProps);
      insufficientProps.tile = _.omit(insufficientProps.tile, 'belongsToCurrentUser');

      console.log("INSUFF", insufficientProps)

      shallowDOM.render(<OriginalTile {...insufficientProps} />);
      errorRegex = new RegExp('Required prop `tile.belongsToCurrentUser` was not specified');

      console.log("let args", consoleStub.callCount, consoleStub.args);
      expect(consoleStub.calledOnce).to.equal(true);
      expect(consoleStub.calledWithMatch(errorRegex)).to.equal(true);
    });



  });

  it('renders correctly', () => {
    shallowDOM.render(
      <OriginalTile
        connectDragSource={identity}
        connectDropTarget={identity}
        isDragging={false}
        isOver={false}
        isMyTurn={false}
        tile={{
          letter: 'J',
          belongsToCurrentUser: 2,
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

    expect(actualElement).to.equalJSX(expectedElement);
  });
});
