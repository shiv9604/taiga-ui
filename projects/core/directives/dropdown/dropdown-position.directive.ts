import {Directive, EventEmitter, inject, Output} from '@angular/core';
import {EMPTY_CLIENT_RECT} from '@taiga-ui/cdk/constants';
import {
    tuiFallbackAccessor,
    TuiPositionAccessor,
    TuiRectAccessor,
} from '@taiga-ui/core/classes';
import {TUI_VIEWPORT} from '@taiga-ui/core/tokens';
import type {TuiPoint, TuiVerticalDirection} from '@taiga-ui/core/types';
import {tuiEmitWhenChanged} from '@taiga-ui/core/utils';

import {TuiDropdownDirective} from './dropdown.directive';
import {TUI_DROPDOWN_OPTIONS} from './dropdown-options.directive';

@Directive({
    standalone: true,
    selector: '[tuiDropdownPosition]',
})
export class TuiDropdownPosition extends TuiPositionAccessor {
    private readonly options = inject(TUI_DROPDOWN_OPTIONS);
    private readonly viewport = inject(TUI_VIEWPORT);

    private previous?: TuiVerticalDirection;
    private lastDirection!: TuiVerticalDirection;

    @Output('tuiDropdownDirectionChange')
    public readonly directionChange = new EventEmitter<TuiVerticalDirection>();

    public readonly type = 'dropdown';
    public readonly accessor: TuiRectAccessor | null =
        tuiFallbackAccessor<TuiRectAccessor>('dropdown')(
            inject<any>(TuiRectAccessor),
            inject(TuiDropdownDirective, {optional: true})!,
        );

    public getPosition({width, height}: DOMRect): TuiPoint {
        if (!width && !height) {
            this.previous = undefined;
        }

        const hostRect = this.accessor?.getClientRect() ?? EMPTY_CLIENT_RECT;
        const viewportRect = this.viewport.getClientRect();
        const {minHeight, align, direction, offset, limitWidth} = this.options;
        const viewport = {
            top: viewportRect.top - offset,
            bottom: viewportRect.bottom + offset,
            right: viewportRect.right - offset,
            left: viewportRect.left + offset,
        } as const;
        const previous = this.previous || direction || 'bottom';
        const available = {
            top: hostRect.top - 2 * offset - viewport.top,
            bottom: viewport.bottom - hostRect.bottom - 2 * offset,
        } as const;
        const rectWidth = limitWidth === 'fixed' ? hostRect.width : width;
        const right = Math.max(hostRect.right - rectWidth, offset);
        const left = hostRect.left + width < viewport.right ? hostRect.left : right;
        const position = {
            top: hostRect.top - offset - height,
            bottom: hostRect.bottom + offset,
            right: Math.max(viewport.left, right),
            center:
                hostRect.left + hostRect.width / 2 + width / 2 < viewport.right
                    ? hostRect.left + hostRect.width / 2 - width / 2
                    : right,
            left: Math.max(viewport.left, left),
        } as const;
        const better: TuiVerticalDirection =
            available.top > available.bottom ? 'top' : 'bottom';

        this.lastDirection = tuiEmitWhenChanged<TuiVerticalDirection>(
            better,
            this.lastDirection,
            this.directionChange,
        );

        if (
            (available[previous] > minHeight && direction) ||
            available[previous] > height
        ) {
            return [position[previous], position[align]];
        }

        this.previous = better;

        return [position[better], position[align]];
    }
}
