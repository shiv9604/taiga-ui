import {NgIf} from '@angular/common';
import type {DoCheck, QueryList} from '@angular/core';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    forwardRef,
    inject,
    SkipSelf,
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {EMPTY_QUERY} from '@taiga-ui/cdk/constants';
import {tuiInjectElement} from '@taiga-ui/cdk/utils/dom';
import {tuiProvide} from '@taiga-ui/cdk/utils/miscellaneous';
import {TuiExpandComponent} from '@taiga-ui/core/components/expand';
import type {PolymorpheusContent} from '@taiga-ui/polymorpheus';
import {PolymorpheusOutlet} from '@taiga-ui/polymorpheus';
import {distinctUntilChanged, map, startWith, Subject} from 'rxjs';

import type {
    TuiTreeAccessor,
    TuiTreeController,
    TuiTreeItemContext,
} from '../../misc/tree.interfaces';
import {
    TUI_TREE_ACCESSOR,
    TUI_TREE_CONTENT,
    TUI_TREE_CONTROLLER,
    TUI_TREE_LEVEL,
    TUI_TREE_NODE,
} from '../../misc/tree.tokens';

@Component({
    standalone: true,
    selector: 'tui-tree-item',
    imports: [NgIf, PolymorpheusOutlet, TuiExpandComponent],
    templateUrl: './tree-item.template.html',
    styleUrls: ['./tree-item.style.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiProvide(TUI_TREE_NODE, TuiTreeItem),
        {
            provide: TUI_TREE_LEVEL,
            deps: [[new SkipSelf(), TUI_TREE_LEVEL]],
            useFactory: (level: number): number => ++level,
        },
    ],
    host: {
        role: 'treeitem',
        '[class._expandable]': 'isExpandable',
    },
})
export class TuiTreeItem implements DoCheck {
    @ContentChildren(TUI_TREE_NODE)
    private readonly nested: QueryList<unknown> = EMPTY_QUERY;

    private readonly el = tuiInjectElement();

    private readonly controller = inject<TuiTreeController>(
        forwardRef(() => TUI_TREE_CONTROLLER),
    );

    private readonly accessor = inject<TuiTreeAccessor<unknown>>(
        forwardRef(() => TUI_TREE_ACCESSOR),
    );

    private readonly change$ = new Subject<void>();

    protected readonly level = inject<number>(forwardRef(() => TUI_TREE_LEVEL));

    protected readonly content = inject<PolymorpheusContent<TuiTreeItemContext>>(
        forwardRef(() => TUI_TREE_CONTENT),
    );

    protected readonly expanded = toSignal(
        this.change$.pipe(
            startWith(null),
            map(() => this.isExpanded),
        ),
        {initialValue: this.isExpanded},
    );

    protected readonly attached = toSignal(
        this.change$.pipe(
            map(() => this.el.isConnected),
            distinctUntilChanged(),
        ),
        {initialValue: this.el.isConnected},
    );

    public get isExpandable(): boolean {
        const parent = this.accessor.getParent(this);

        return !!this.nested.length && (parent ? parent.isExpanded : true);

        // return !!this.nested.length;
    }

    public get isExpanded(): boolean {
        return this.controller.isExpanded(this);
    }

    public ngDoCheck(): void {
        this.checkChanges();
    }

    public checkChanges(): void {
        this.change$.next();
    }
}
