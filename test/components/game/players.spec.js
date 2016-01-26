import _          from 'lodash';
import React      from 'react';
import { expect } from 'chai';
import sinon      from 'sinon';
import TestUtils  from 'react-addons-test-utils';

import Players    from '../../../common/components/game/side_panel/Players.jsx';

const shallowDOM = TestUtils.createRenderer();


describe('Players component', () => {
  describe('propTypes', () => {
    let consoleStub;

    before(     () => consoleStub = sinon.stub(console, 'error') );
    afterEach(  () => consoleStub.reset() );
    after(      () => consoleStub.restore() );

    it('throws when players are not provided', () => {
      // It doesn't even make it to the console warn, because not having
      // a players array causes the component to crash. Just as well.
      expect(shallowDOM.render.bind(null, <Players />)).to.throw();
    });
  });
  it('sorts players by points', () => {
    const dick    = { id: '456', username: 'Dick', points: 12 };
    const tom     = { id: '123', username: 'Tom', points: 5 }
    const players = [ tom, dick ];

    shallowDOM.render(<Players players={players} />);

    const component = shallowDOM.getRenderOutput();

    const [ p1, p2 ] = component.props.children;

    expect(component.props.children).to.have.length.of(2);
    expect(p1.props).to.deep.equal(dick);
    expect(p2.props).to.deep.equal(tom);
  });
});
