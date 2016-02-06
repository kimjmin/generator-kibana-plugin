import moment from 'moment';

import uiRoutes from 'ui/routes';
import uiModules from 'ui/modules';

import template from './<%= app_id %>.html';

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/<%= app_id %>/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

uiModules
.get('app/<%= appId %>', [])
.controller('<%= appId %>Controller', function ($scope, $route, $interval) {
  $scope.title = '<%= appTitle %>';
  $scope.description = '<%= appDescription %>';

  var currentTime = moment($route.current.locals.currentTime);
  $scope.currentTime = currentTime.format('HH:mm:ss');
  var unsubscribe = $interval(function () {
    $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
  }, 1000);
  $scope.$watch('$destroy', unsubscribe);
});
