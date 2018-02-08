var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

var pokeFactory = function ($resource) {
    // return $resource('http://rest-service.guides.spring.io/greeting', {slug: '@slug'},
    return $resource('https://pokeapi.co/api/v2/pokemon/:id/', {id: '@id'},
        {
            'update': {method: 'PUT'},
        });
};

pokeApp.factory('PokemApi', ['$resource', pokeFactory]);

pokeApp.factory('ServicePartage', function () {
    var Poke = {
        foo: 'Shared service',
        pokemon: {}
    };
    return Poke;
});


pokeApp.controller('searchController', ['$scope', '$log', '$http', 'PokemApi', 'ServicePartage', function ($scope, $log, $http, PokemApi, ServicePartage) {
    $scope.$log = $log;
    $scope.firstName = "Nabé";
    $scope.lastName = "Diarra";
    $scope.pokemons = [];
    $scope.pokeSelect = 0;
    $scope.selectedPokeId;

    $scope.httpApiCall = function () {
        $http.get('https://pokeapi.co/api/v2/pokedex/1').then(function (response) {
            $scope.pokemons = response.data.pokemon_entries;
        });
    }

    //Au chargement
    $scope.httpApiCall();

    $scope.getSelectedPoke = function () {
        if ($scope.pokeSelect != null) {
            $scope.selectedPokeId = $scope.pokeSelect;
            ServicePartage.pokemon.id = $scope.selectedPokeId;
            $log.info("selected");
        }
    };

}]);


pokeApp.controller('detailsController', ['$scope', '$log', '$http', 'PokemApi', 'ServicePartage', function ($scope, $log, $http, PokemApi, ServicePartage) {
    $scope.$log = $log;
    $scope.selectedPokeId;
    $scope.pokemonName;
    $scope.pokemonDetails = [];
    $scope.pokemonMoves = [];

    $scope.getPokemonResource = function () {
        $scope.selectedPokeId = ServicePartage.pokemon.id;
        $log.info("infos : " + $scope.selectedPokeId);
        $scope.pokemonDetails = PokemApi.get({id: $scope.selectedPokeId}, function (response) {
            $scope.pokemonName = response.name;
            $scope.pokemonId = response.id;
            $scope.pokemonMoves = response.moves;
            $log.info($scope.pokemonPokeId + ", " + $scope.pokemonPokeName);
        });

    }

    $scope.seePokeInfos = function () {
        $scope.getPokemonResource();
    };


}]);

