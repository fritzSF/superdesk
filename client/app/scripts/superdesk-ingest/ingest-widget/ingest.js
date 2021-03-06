(function() {
    'use strict';

    angular.module('superdesk.widgets.ingest', [
        'superdesk.widgets.base',
        'superdesk.authoring.widgets'
    ])
        .config(['dashboardWidgetsProvider', function(dashboardWidgets) {
            dashboardWidgets.addWidget('ingest', {
                label: 'Ingest',
                multiple: true,
                icon: 'ingest',
                max_sizex: 2,
                max_sizey: 2,
                sizex: 1,
                sizey: 2,
                thumbnail: 'scripts/superdesk-ingest/ingest-widget/thumbnail.svg',
                template: 'scripts/superdesk-ingest/ingest-widget/widget-ingest.html',
                configurationTemplate: 'scripts/superdesk-archive/archive-widget/configuration.html',
                configuration: {maxItems: 10, savedSearch: null, updateInterval: 5},
                description: 'Ingest widget'
            });
        }])
        .controller('IngestController', ['$scope', 'api', 'BaseWidgetController',
        function ($scope, api, BaseWidgetController) {
            $scope.type = 'ingestWidget';
            $scope.itemListOptions = {
                endpoint: 'search',
                repo: 'ingest',
                notStates: ['spiked'],
                types: ['text', 'picture', 'audio', 'video', 'composite'],
                page: 1
            };
            $scope.options = {
                pinEnabled: true,
                modeEnabled: true,
                searchEnabled: true,
                itemTypeEnabled: true,
                mode: 'basic',
                pinMode: 'ingest',
                similar: false,
                itemTypes: ['text', 'picture', 'audio', 'video', 'composite']
            };

            BaseWidgetController.call(this, $scope);
        }]);
})();
