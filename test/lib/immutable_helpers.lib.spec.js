import { expect }             from 'chai';
import { List, Map, fromJS }  from 'immutable';

import { immu_pluck }         from '../../common/lib/immutable_helpers.lib.js';

describe('Immutable Helpers', () => {
  describe('#immu_pluck', () => {
    it('plucks a single value out of a List of Maps', () => {
      const data = fromJS([
        { letter: 'B', points: 4 },
        { letter: 'A', points: 1 },
        { letter: 'M', points: 3 }
      ]);
      const letters = immu_pluck(data, 'letter');

      expect(letters).to.equal(fromJS(['B', 'A', 'M']));
    });

    it('throws an exception when a normal array is provided', () => {
      const data = [
        { letter: 'B', points: 4 },
        { letter: 'A', points: 1 },
        { letter: 'M', points: 3 }
      ];

      const bad_function = () => immu_pluck(data, 'letter')

      expect(bad_function).to.throw;
    });

    it('throws an exception when no field name is provided', () => {
      const data = [
        { letter: 'B', points: 4 },
        { letter: 'A', points: 1 },
        { letter: 'M', points: 3 }
      ];

      const bad_function = () => immu_pluck(data)

      expect(bad_function).to.throw;
    })


  });
});
