define([
    'jquery',
    'angular',
    'moment'
], function($, angular, moment) {
    'use strict';

    angular.module('superdesk.items.directives', []).
        filter('reldate', function() {
            return function(date) {
                return moment(date).fromNow();
            };
        }).
        directive('sdSearchbar', function($location, $routeParams) {
            return {
                link: function($scope, element, attrs) {
                    element.attr('name', 'searchbar');
                    element.attr('autofocus', 'autofocus');
                    element.addClass('searchbar-container');

                    if ('q' in $routeParams) {
                        element.val($routeParams.q);
                    }

                    $(element).change(function() {
                        $scope.$apply(function() {
                            var query = element.val();
                            if (query && query.length > 2) {
                                $location.search('q', query);
                                $location.search('skip', null);
                            } else if (query.length === 0) {
                                $location.search('q', null);
                                $location.search('skip', null);
                            }
                        });
                    });
                }
            };
        }).
        directive('sdHtml', function($sce) {
            return {
                require: '?ngModel',
                link: function($scope, element, attrs, ngModel) {
                    ngModel.$render = function() {
                        element.prepend(ngModel.$viewValue);
                    };
                }
            };
        }).
        directive('sdContent', function() {
            function getText(content) {
                var lines = $(content);
                var texts = [];
                for (var i = 0; i < lines.length; i++) {
                    var el = $(lines[i]);
                    if (el.is('p')) {
                        texts.push(el[0].outerHTML);
                    }
                }

                return texts.join('\n');
            }

            return {
                require: '?ngModel',
                link: function($scope, element, attrs, ngModel) {
                    ngModel.$render = function() {
                        element.html(getText(ngModel.$viewValue.content));
                    };
                }
            };
        }).
        directive('sdContenteditable', function() {
            return {
                require: 'ngModel',
                link: function($scope, element, attrs, ngModel) {
                    element.attr('contenteditable', 'true');

                    $(element).keyup(function(e) {
                        $scope.$apply(function() {
                            ngModel.$setViewValue(element.html());
                        });
                    });

                    ngModel.$render = function() {
                        var model = ngModel.$viewValue;
                        if (angular.isString(model)) {
                            element.html(model);
                        } else {
                            switch (model.contenttype) {
                            case 'application/xhtml+html':
                            case 'application/xhtml+xml':
                                element.html(model.content);
                                break;

                            case 'image/jpeg':
                                if (model.rendition !== 'rend:viewImage') {
                                    break;
                                }

                                $('<img />').
                                    attr('src', model.href).
                                    appendTo(element);
                                break;

                            case 'audio/mpeg':
                                $('<audio controls>').
                                    attr('src', model.href).
                                    appendTo(element);
                                break;

                            case 'video/mpeg':
                                if (model.rendition !== 'rend:stream:700:16x9:mp4') {
                                    break;
                                }

                                $('<video controls>').
                                    attr('src', model.href).
                                    appendTo(element);
                                break;

                            default:
                                console.log(model);
                            }
                        }
                    };
                }
            };
        });
});