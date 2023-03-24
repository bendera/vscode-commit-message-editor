import { browser } from '@wdio/globals';

describe('My VS Code Extension', () => {
  it('should be able to load VS Code', async () => {
    const workbench = await browser.getWorkbench();

    await browser.pause(10000);

    expect(await workbench.getTitleBar().getTitle()).toBe(
      '[Extension Development Host] Visual Studio Code'
    );
  });
});
