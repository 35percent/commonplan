var addStream = require('add-stream');
var concat = require('gulp-concat');

gulp.task('js', function() {
  return gulp.src('./public/js/app.js')
    .pipe(addStream.obj(makeConfig())) // makeConfig is defined a few code blocks up
    .pipe(concat('controller.js'))
    .pipe(gulp.dest('...'));
});

// inject the constants
angular.module('justMap', ['justMap.config']).run(function (name) {
  console.log("The name constant!", name) // outputs "justMap"
});


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
    .controller("ListController", function(contacts, $scope) {
        $scope.contacts = contacts.data;

angular.extend($scope, {
                center: {
                    lat: 51.487, 
                    lng: -0.1008511,
                    zoom: 15
                },
                layers: {
                    baselayers: {
                        mapbox_light: {
                            name: 'EWNF Boundary',
                            url: 'https://api.mapbox.com/styles/v1/commonplan/civobzeva00442ko4gqzy0gq0/tiles/256/{z}/{x}/{y}?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiY29tbW9ucGxhbiIsImEiOiJjaXZvNHpsemcwMDB6MnRrd3kwYXBnN2NsIn0.Lqx-zAhA3p9N1XV3jV7Dog',
                                mapid: 'commonplan.civo5q8zk00122np8fv6bdtm8-606p3'
                            }
                        },
                        osm: {
                            name: 'General Map',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                defaults: {
                scrollWheelZoom: false
        }
     });

             $scope.markers = new Array();
             angular.forEach($scope.contacts, function(contact, i) {
                $scope.markers.push({
                    lat: contact.phone.work, 
                    lng: contact.phone.mobile, 
                    getMessageScope: function() { return $scope; },
                    message: "<popup contact='contacts[" + i + "]'></popup>" 
                });
            });     
    })
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
                lat: 51.48737, 
                lng: -0.1008511,
                focus: true,
                message: "Drag me to the location</br>you want to comment on!",
                draggable: true
            };

angular.extend($scope, {
                center: {
                    lat: 51.48662095820769,
                    lng: -0.0885772705078125,
                    zoom: 15
                },
                layers: {
                    baselayers: {
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'https://api.mapbox.com/styles/v1/commonplan/civobzeva00442ko4gqzy0gq0/tiles/256/{z}/{x}/{y}?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoiY29tbW9ucGxhbiIsImEiOiJjaXZvNHpsemcwMDB6MnRrd3kwYXBnN2NsIn0.Lqx-zAhA3p9N1XV3jV7Dog',
                                mapid: 'commonplan.civo5q8zk00122np8fv6bdtm8-606p3'
                            }
                        },
                        osm: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                defaults: {
                scrollWheelZoom: false
        },
                markers: {
                    mainMarker: angular.copy(mainMarker)
                },
                contact: {
                    phone: {
                         work: 51.48654078832186,
                         mobile: -0.08849143981933594
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
