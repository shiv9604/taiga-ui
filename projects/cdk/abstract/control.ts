import {ChangeDetectorRef, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NgControl, NgModel} from '@angular/forms';
import {tuiAssert} from '@taiga-ui/cdk/classes';
import {tuiDefaultProp} from '@taiga-ui/cdk/decorators';
import {TuiValidation} from '@taiga-ui/cdk/enums';
import {fallbackValue} from '@taiga-ui/cdk/utils/miscellaneous';
import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AbstractTuiInteractive} from './interactive';

/**
 * Basic ControlValueAccessor class to build form components upon
 */
export abstract class AbstractTuiControl<T>
    extends AbstractTuiInteractive
    implements OnDestroy, OnInit, ControlValueAccessor {
    private previousInternalValue?: T;

    private onTouched?: () => void;

    private onChange?: (value: T) => void;

    protected readonly fallbackValue = this.getFallbackValue();

    protected readonly destroy$ = new Subject<void>();

    @Input()
    @tuiDefaultProp()
    success = false;

    @Input()
    @HostBinding('class._readonly')
    @tuiDefaultProp()
    readOnly = false;

    @Input()
    @tuiDefaultProp()
    pseudoValidation: TuiValidation | null = null;

    protected constructor(
        private readonly ngControl: NgControl | null,
        protected readonly changeDetectorRef: ChangeDetectorRef,
    ) {
        super();

        if (ngControl === null) {
            tuiAssert.assert(
                false,
                `NgControl not injected in ${this.constructor.name}!\n`,
                'Use [(ngModel)] or [formControl] or formControlName for correct work.',
            );
        } else {
            ngControl.valueAccessor = this;
        }
    }

    @HostBinding('attr.data-tui-host-validation')
    get computedValidation(): TuiValidation {
        if (this.readOnly || this.disabled) {
            return TuiValidation.Normal;
        }

        if (this.pseudoValidation !== null) {
            return this.pseudoValidation;
        }

        return this.validation;
    }

    get validationSuccess(): boolean {
        return this.computedValidation === TuiValidation.Success;
    }

    get validation(): TuiValidation {
        if (this.touched && this.invalid) {
            return TuiValidation.Error;
        }

        if (this.success) {
            return TuiValidation.Success;
        }

        return TuiValidation.Normal;
    }

    get value(): T {
        return fallbackValue<T>(this.previousInternalValue, this.fallbackValue);
    }

    get safeCurrentValue(): T {
        return fallbackValue<T>(this.rawValue, this.fallbackValue);
    }

    get invalid(): boolean {
        return this.safeNgControlData<boolean>(({invalid}) => invalid, false);
    }

    get touched(): boolean {
        return this.safeNgControlData<boolean>(({touched}) => touched, false);
    }

    get disabled(): boolean {
        return this.safeNgControlData<boolean>(({disabled}) => disabled, false);
    }

    get control(): AbstractControl | null {
        return this.safeNgControlData<AbstractControl | null>(
            ({control}) => control,
            null,
        );
    }

    get computedName(): string | null {
        return this.controlName;
    }

    protected get controlName(): string | null {
        return this.ngControl === null ? null : this.ngControl.name;
    }

    private get rawValue(): T | undefined {
        const {ngControl} = this;

        if (ngControl === null) {
            return undefined;
        }

        return ngControl instanceof NgModel && this.previousInternalValue === undefined
            ? ngControl.viewModel
            : ngControl.value;
    }

    ngOnInit() {
        if (
            !this.ngControl ||
            !this.ngControl.valueChanges ||
            !this.ngControl.statusChanges
        ) {
            return;
        }

        merge(this.ngControl.valueChanges, this.ngControl.statusChanges)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.refreshLocalValue(this.safeCurrentValue);
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    checkControlUpdate() {
        this.changeDetectorRef.markForCheck();
    }

    registerOnChange(onChange: (value: T) => void) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: () => void) {
        this.onTouched = onTouched;
    }

    setDisabledState() {
        this.checkControlUpdate();
    }

    writeValue(value: T) {
        this.refreshLocalValue(
            this.ngControl instanceof NgModel && this.previousInternalValue === undefined
                ? this.ngControl.model
                : value,
        );
    }

    protected abstract getFallbackValue(): T;

    protected updateFocused(focused: boolean) {
        if (!focused) {
            this.controlMarkAsTouched();
        }

        super.updateFocused(focused);
    }

    protected updateValue(value: T) {
        if (this.disabled || this.valueIdenticalComparator(this.value, value)) {
            return;
        }

        this.previousInternalValue = value;
        this.controlSetValue(value);
    }

    protected valueIdenticalComparator(oldValue: T, newValue: T): boolean {
        return oldValue === newValue;
    }

    private safeNgControlData<T>(
        extractor: (ngControl: NgControl) => T | null | undefined,
        defaultFieldValue: T,
    ): T {
        return this.ngControl === null
            ? defaultFieldValue
            : fallbackValue<T>(extractor(this.ngControl), defaultFieldValue);
    }

    private controlMarkAsTouched() {
        if (this.onTouched) {
            this.onTouched();
        }

        this.checkControlUpdate();
    }

    private controlSetValue(value: T) {
        if (this.onChange) {
            this.onChange(value);
        }

        this.checkControlUpdate();
    }

    private refreshLocalValue(value: T) {
        this.previousInternalValue = value;
        this.checkControlUpdate();
    }
}
