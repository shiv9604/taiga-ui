import type {Locator} from '@playwright/test';

export class TuiInputDatePO {
    public readonly textfield: Locator = this.host.getByRole('textbox');
    public readonly calendar: Locator = this.host.page().locator('tui-calendar');

    constructor(private readonly host: Locator) {}

    public async clickItemButton(): Promise<void> {
        const itemButton = this.host
            .page()
            .locator('[automation-id="tui-input-date__button"]');

        await itemButton.click();
    }
}
