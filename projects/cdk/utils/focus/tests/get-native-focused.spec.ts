import {getNativeFocused} from '../get-native-focused';

describe('getNativeFocused', () => {
    it('returns active focused element in document', () => {
        const buttonElement = document.createElement('button');

        document.body.appendChild(buttonElement);
        buttonElement.focus();

        expect(getNativeFocused(document)).toBe(buttonElement);
    });

    it('returns element from shadowRoot', () => {
        const div = document.createElement('div');
        const buttonElement = document.createElement('button');

        document.body.appendChild(div);

        const root = div.attachShadow({mode: 'open'});

        root.appendChild(buttonElement);
        buttonElement.focus();

        expect(getNativeFocused(document)).toBe(buttonElement);
    });
});
