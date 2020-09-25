import {TuiMatcher} from '../../../types/matcher';
import {TuiFilterPipe} from '../filter.pipe';

describe('TuiFilter pipe', () => {
    let pipe: TuiFilterPipe<string>;
    const data = ['two', 'eleven'];
    const args = ['two', 'four'];
    const matcher: TuiMatcher<string> = (item, search, ...rest) =>
        item.length === search || rest.indexOf(item) !== -1;

    beforeEach(() => {
        pipe = new TuiFilterPipe();
    });

    it('Filter works', () => {
        expect(pipe.transform(data, matcher, 6)).toEqual([data[1]]);
    });

    it('Filter returns empty array if nothing matched', () => {
        expect(pipe.transform(data, matcher, 5)).toEqual([]);
    });

    it('Filter works with extra arguments', () => {
        expect(pipe.transform(data, matcher, 5, ...args)).toEqual([data[0]]);
    });
});
