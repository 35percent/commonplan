angular.module("contactsApp", ['ngRoute', 'leaflet-directive'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function(Contacts) {
                        return Contacts.getContacts();
                    }
                }
            })
            .when("/new/contact", {
                controller: "NewContactController",
                templateUrl: "contact-form.html"
            })
            .when("/contact/:contactId", {
                controller: "EditContactController",
                templateUrl: "contact.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Contacts", function($http) {
        this.getContacts = function() {
            return $http.get("/contacts").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });
        }
        this.createContact = function(contact) {
            return $http.post("/contacts", contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
        this.getContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
        this.editContact = function(contact) {
            var url = "/contacts/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });
        }
    })
    .directive('popup', ['$http', '$compile', function($http, $compile) {
    return {
        restrict: 'E',
        scope: {
            contact: "="
        },
        templateUrl: 'popup.html'
    };
    }])
    .controller("ListController", [ '$scope', '$http', 'contacts', function($scope, $http, contacts) {
        $scope.contacts = contacts.data;

   var featuresData = {};
    angular.extend($scope, {
        center: {
            lat: -33.8979173,
            lng: 151.2323598,
            zoom: 14
        },
        tiles: {
                    name: 'Mapbox Park',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    options: {
                        apikey: 'pk.eyJ1IjoiZmVlbGNyZWF0aXZlIiwiYSI6Ik1Gak9FXzAifQ.9eB142zVCM4JMg7btDDaZQ',
                        mapid: 'feelcreative.llm8dpdk'
                    }
        },
        geojson: {}
    });
    
    $http.get("https://a.tiles.mapbox.com/v4/feelcreative.llm8dpdk/features.json?access_token=pk.eyJ1IjoiZmVlbGNyZWF0aXZlIiwiYSI6Ik1Gak9FXzAifQ.9eB142zVCM4JMg7btDDaZQ").success(function(data) {
                $scope.geojson.data = data;
                featuresData = data;
                $scope.geojson.style = style;
                console.log(data);
                
     });
    
    function style(feature) {
                console.log(feature.properties);
                return {
                    fillColor: feature.properties.fill,
                    opacity: feature.properties['stroke-opacity'],
                    color: feature.properties.stroke,
                    fillOpacity: feature.properties['fill-opacity']
                };
            }
            $scope.markers = new Array();
             angular.forEach($scope.contacts, function(contact, i) {
                $scope.markers.push({
                    lat: contact.phone.work, 
                    lng: contact.phone.mobile, 
                    getMessageScope: function() { return $scope; },
                    message: "<popup contact='contacts[" + i + "]'></popup>" 
                });
            });     
}]);
    .controller("NewContactController", function($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveContact = function(contact) {
            Contacts.createContact(contact).then(function(doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path("#/");
            }, function(response) {
                alert(response);
            });
        }
var mainMarker = {
                lat: 51,
                lng: 0,
                focus: true,
                message: "Drag me to the location</br>you want to comment on!",
                draggable: true
            };
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    mainMarker: angular.copy(mainMarker)
                },
                contact: {
                    phone: {
                         work: 51,
                         mobile: 0
                         }
                },
                events: { // or just {} //all events
                    markers:{
                      enable: [ 'dragend' ]
                      //logic: 'emit'
                    }
                }
            });
            $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                $scope.contact.phone.work = args.model.lat;
                $scope.contact.phone.mobile = args.model.lng;
            });
    })
    .controller("EditContactController", function($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.contactId).then(function(doc) {
            $scope.contact = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "contact-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.saveContact = function(contact) {
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.deleteContact = function(contactId) {
            Contacts.deleteContact(contactId);
        }
    });
