import _          from 'lodash';
import React      from 'react';
import { expect } from 'chai';
import sinon      from 'sinon';

import TestUtils, { createRenderer } from 'react-addons-test-utils';

import dndWrapInTestContext from '../../utils/dnd_wrap_in_test_context';

import Tile       from '../../../common/components/game/Tile.jsx';
import Controls   from '../../../common/components/game/Controls.jsx';

// We need a DOM!
import testdom    from 'testdom';
testdom('<html><body></body></html>')


// Obtain the reference to the component before React DnD wrapping
const OriginalTile = Tile.DecoratedComponent.DecoratedComponent;

const shallowDOM = createRenderer();

describe('Tile', () => {
  describe('propTypes', () => {
    let consoleStub;

    before( () => consoleStub = sinon.stub(console, 'error') );
    afterEach( () => consoleStub.reset() );
    after( () => consoleStub.restore() );

    const exampleProps = generateProps();
    let insufficientProps, errorRegex;

    // Iterate through all top-level props, checking to see if it warns when
    // one is missing
    _.keys(exampleProps).forEach( prop => {
      // Don't test `tile`. It's complicated, and will be tested separately.
      if ( prop === 'tile' ) return;

      // Don't test React DnD stubbed functions. Problems happen when they
      // aren't supplied.
      if ( _.includes(['connectDropTarget', 'connectDragSource'], prop) )
        return;

      it(`throws without '${prop}'`, () => {
        insufficientProps = _.omit(exampleProps, prop);
        shallowDOM.render(<OriginalTile {...insufficientProps} />);
        errorRegex = new RegExp(`Required prop \`${prop}\` was not specified`);

        expect(consoleStub.calledOnce).to.equal(true);
        expect(consoleStub.calledWithMatch(errorRegex)).to.equal(true);
      });
    });

    // Iterate through the tile props
    _.keys( exampleProps.tile ).forEach( tileProp => {
      it(`throws without Tile's '${tileProp}'`, () => {
        let tile = _.omit(exampleProps.tile, tileProp);
        insufficientProps = _.extend({}, exampleProps, { tile });
        shallowDOM.render(<OriginalTile {...insufficientProps} />);
        errorRegex = new RegExp(`Required prop \`tile.${tileProp}\` was not specified`);

        expect(consoleStub.calledOnce).to.equal(true);
        expect(consoleStub.calledWithMatch(errorRegex)).to.equal(true);
      });
    });
  });

  // React DnD test docs are nonexistent.
  // Maybe use: http://reactjsnews.com/testing-drag-and-drop-components-in-react-js/

  xdescribe('drag and drop', () => {

    it('can drag one tile onto another', () => {
      // Create a dummy "rack" component to house our Tiles
      class Rack extends Component {
        render() {
          return (
            <div id="rack">
              {this.children}
            </div>
          )
        }
      };

      const TileContext = dndWrapInTestContext(Tile);

      let tile1 = generateProps({ tile: { x: 2, letter: 'A' } });
      let tile2 = generateProps({ tile: { x: 4, letter: 'T' } });

      const root = TestUtils.renderIntoDocument(
          <TileContext {...tile2} />
      );
      // const manager = root.getManager();
      // const backend = manager.getBackend();

      let [renderedTile1, renderedTile2] = TestUtils.scryRenderedComponentsWithType(root, Tile);
    });
  });


  describe('draggable class', () => {
    // The rules for whether a tile can be dragged are simple:
    // It needs to be my turn, my tile, and tentative.
    it('is false when it is not my turn', () => {
      const props = generateProps({ isMyTurn: false });
      const element = render( <OriginalTile { ...props }/> );

      const classNames = element.props.className.split(' ');
      expect(classNames).to.include('tile');
      expect(classNames).not.to.include('draggable');
    });

    it('is false when the tile is established', () => {
      const props = generateProps({ tile: { turnId: 0 } });
      const element = render( <OriginalTile { ...props }/> );

      const classNames = element.props.className.split(' ');
      expect(classNames).to.include('tile');
      expect(classNames).not.to.include('draggable');
    });

    it('is false when it is not my tile', () => {
      const props = generateProps({ tile: { belongsToCurrentUser: false } });
      const element = render( <OriginalTile { ...props }/> );

      const classNames = element.props.className.split(' ');
      expect(classNames).to.include('tile');
      expect(classNames).not.to.include('draggable');
    });

    it('is true when those 3 conditions are met', () => {
      const props = generateProps();
      const element = render( <OriginalTile { ...props }/> );

      const classNames = element.props.className.split(' ');
      expect(classNames).to.include('tile');
      expect(classNames).to.include('draggable');
    });
  });

  describe("established tiles", () => {
    it('adds a class when the tile is established', () => {
      const props = generateProps({ tile: { turnId: 0 } });
      const element = render( <OriginalTile { ...props }/> );
      const classNames = element.props.className.split(' ');
      expect(classNames).to.include('tile');
      expect(classNames).to.include('is-established');
    });

    it('does not add a class when the tile is tentative', () => {
      const props = generateProps();
      const element = render( <OriginalTile { ...props }/> );
      const classNames = element.props.className.split(' ');
      expect(classNames).to.include('tile');
      expect(classNames).not.to.include('is-established');
    });
  });

  it('renders correctly', () => {
    const actualElement = render( <OriginalTile { ...generateProps() }/> );
    const expectedElement = (
      <div className="tile draggable">
        <div className="tile-letter">J</div>
        <div className="tile-points">2</div>
      </div>
    );

    expect(actualElement).to.equalJSX(expectedElement);
  });
});


  ////////////////////////////
 /////// TEST HELPERS ///////
////////////////////////////

// Merge in quick tweaks to a working set of props
function generateProps(overrides) {
  // Stub the React DnD connector functions with an identity function
  const identity = el => el;

  const defaultProps = {
    connectDragSource:  identity,
    connectDropTarget:  identity,
    isDragging:         false,
    isOver:             false,
    isMyTurn:           true,
    tile: {
      letter: 'J',
      points: 2,
      belongsToCurrentUser: true,
      location: 'rack'
    }
  };

  return _.merge({}, defaultProps, overrides);
}

// Get rendered output
function render(component) {
  shallowDOM.render(component);
  return shallowDOM.getRenderOutput();
}
