import { browser } from '@wdio/globals';

describe('My VS Code Extension', () => {
  it('should be able to load VS Code', async () => {
    const workbench = await browser.getWorkbench();

    // await browser.pause(10000);

    expect(await workbench.getTitleBar().getTitle()).toBe(
      '[Extension Development Host] vscode-commit-message-editor - Visual Studio Code'
    );
  });

  it('commit message editor should be opened on a new tab', async () => {
    const workbench = await browser.getWorkbench();
    const activityBar = workbench.getActivityBar();
    const scmItem = await activityBar.getViewControl('Source Control');
    const sidebar = await scmItem.openView();

    const btn = sidebar.elem.$('.action-item[title="Open commit message editor"]');
    btn.click();

    await browser.waitUntil(async () =>
      (
        await workbench.getTitleBar().getTitle()
      ).includes('Commit Message Editor')
    );
  });
});
