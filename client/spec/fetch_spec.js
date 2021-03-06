
'use strict';

var workspace = require('./helpers/pages').workspace,
    content = require('./helpers/pages').content,
    authoring = require('./helpers/authoring'),
    desks = require('./helpers/desks');

describe('fetch', function() {
    beforeEach(function() {
        workspace.open();
        workspace.switchToDesk('SPORTS DESK');
        content.setListView();
    });

    xit('items in personal should have copy icon and in desk should have duplicate icon',
        function() {
            var menu = content.openItemMenu('item4');

            expect(menu.element(by.partialLinkText('Duplicate')).isDisplayed()).toBe(true);
            expect(menu.element(by.partialLinkText('Copy')).isPresent()).toBe(false);

            workspace.switchToDesk('PERSONAL');
            content.setListView();

            menu = content.openItemMenu('item1');
            expect(menu.element(by.partialLinkText('Copy')).isDisplayed()).toBe(true);
            expect(menu.element(by.partialLinkText('Duplicate')).isPresent()).toBe(false);
        }
    );

    // @todo(petr): figure out how it should work for authoring+list
    xit('can fetch from ingest with keyboards', function() {
        var body;
        workspace.openIngest();
        // select & fetch item
        body = $('body');
        body.sendKeys(protractor.Key.DOWN);
        body.sendKeys('f');
        workspace.open();
        workspace.switchToDesk('SPORTS DESK');
        expect(content.count()).toBe(3);
    });

    it('can fetch from ingest with menu', function() {
        workspace.openIngest();
        content.actionOnItem('Fetch', 0);
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can fetch from content with menu', function() {
        workspace.openIngest();
        content.actionOnItem('Fetch', 0);
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can fetch as', function() {
        workspace.openIngest();
        content.actionOnItem('Fetch To', 0);
        content.send();
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can not Fetch-and-Open if selected desk as a non-member', function() {
        workspace.openIngest();
        content.actionOnItem('Fetch To', 0);

        var btnFetchAndOpen = element(by.css('[ng-disabled="disableFetchAndOpenButton()"]'));
        expect(btnFetchAndOpen.getAttribute('disabled')).toBeFalsy();

        // Adding a new desk with no member, which serves as a non-member desk when selected
        desks.openDesksSettings();
        desks.getNewDeskButton().click();
        desks.deskNameElement().sendKeys('Test Desk');
        desks.deskDescriptionElement().sendKeys('Test Description');
        desks.deskSourceElement().sendKeys('Test Source');
        desks.setDeskType('authoring');
        desks.actionDoneOnGeneralTab();

        workspace.openIngest();
        content.actionOnItem('Fetch To', 0);
        authoring.selectDeskforSendTo('Test Desk');
        expect(btnFetchAndOpen.getAttribute('disabled')).toBeTruthy();
    });

    it('can fetch multiple items', function() {
        workspace.openIngest();
        content.selectItem(0);
        element(by.id('fetch-all-btn')).click();
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can fetch as multiple items', function() {
        workspace.openIngest();
        content.selectItem(0);
        element(by.id('fetch-all-as-btn')).click();
        content.send();
        workspace.openContent();
        expect(content.count()).toBe(3);
    });
});
