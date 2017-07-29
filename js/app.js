var map;
// creat a blank array for all markers.
var markers = [];

//My Google Maps Demo {lat: 30.166921, lng: 30.482845}

var locations = [{
        title: 'San Stefano Grand Plaza Mall',
        location: {
            lat: 31.245755,
            lng: 29.965982
        },
        address: 'El-Gaish Rd san Stefano Qism El-Raml  Alexandria Governorate',
        description: ' one of the Biggest mall in Alexandria on ariver.'
    },
    {
        title: 'Cairo Festival City',
        location: {
            lat: 30.028461,
            lng: 31.405400
        },
        address: 'Cairo Festival City Nasr City Cairo Governorate',
        description: 'Cairo Festival City is a visionary mixed-use urban community strategically located at the gateway to New Cairo city.'
    },
    {
        title: 'Dandy mega mall',
        location: {
            lat: 30.064334,
            lng: 31.027134
        },
        address: 'Alexandria Desert Rd Giza Governorate',
        description: 'This was the first mall opened in this area near beside the smart village in Giza Egypt. '
    },
    {
        title: 'Mall of Arabia',
        location: {
            lat: 30.007637,
            lng: 30.973523
        },
        address: '26th of July Corridor, Giza Governorate',
        description: 'Since the launch of Mall of Arabia Cairo in December 2010, the Group has invested extensively in the areas of retail development and fashion retail in Egypt.'
    },
    {
        title: 'Mall of Egypt',
        location: {
            lat: 29.973152,
            lng: 31.017687
        },
        address: 'Al Wahat Road Giza، 6th of October City، Giza Governorate',
        description: 'Mall of Arabia is Egypt Biggest Mall in terms of space and number of stores'
    },
    {
        title: 'CityStars',
        location: {
            lat: 30.075086,
            lng: 31.346283
        },
        address: 'Omar Ibn El-Khattab, Masaken Al Mohandesin, Nasr City, Cairo Governorate',
        description: 'Building on our previous achievements and unique position in the Egyptian market,Citystars Heliopolis in Cairo'
    }
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.166921,
            lng: 30.482845
        },
        zoom: 8
    });


    //list of malls in egypt

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    //this group uses the location array to creat array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // get the position from the location array
        var position = locations[i].location;
        var title = locations[i].title;
        var address = locations[i].address;
        var description = locations[i].description;
        //creat a marker per location and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            address: address,
            description: description,
            animation: google.maps.Animation.DROP,
            id: i
        });
        //push the marker to our array of markers.
        markers.push(marker);
        //extend the boundaries of the map for each marker
        // console.log(marker.position);
        bounds.extend(marker.position);

        //creat an onclick event to open an infowindows at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
locations[i].locationMark=marker;
    }
    map.fitBounds(bounds);
    ko.applyBindings(new AppViewModel());
}

//this function popualates the infowindow when the marker is clicked.
function populateInfoWindow(marker, infowindow) {
    //it's mean marker info isn't open and if isn't, open it.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        //wiki url search for ajax
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

        // set timeout function to alert errors in 5 seconde
        var wikiTimeout = setTimeout(function () {
            alert("error: the process is failed");
        }, 5000);
        //ajax request
        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",

            success: function (response) {
                var articleList = response[1];
                var url = 'http://en.wikipedia.org/wiki/' + articleList[0];
                //this function to separate who has link on wiki to put it or not after ajax response
                if (!url.includes('undefined')) {
                    infowindow.setContent('<div id="infobox"><h3>' + marker.title + '</h3>' + '<br><h4>address:</h4><p>' + marker.address + '</p></br>' + '<h4>description:</h4><p>' + marker.description + '<br />Wiki Page:<br /><a href="' + url + '">' + url + '</a></br></div');
                } else {
                    infowindow.setContent('<div id="infobox"><h3>' + marker.title + '</h3>' + '<br><h4>address:</h4><p>' + marker.address + '</p></br>' + '<h4>description:</h4><p>' + marker.description + '</p></br></div');
                }
                clearTimeout(wikiTimeout);
            }
        });
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.DROP);
        // to clear marker when infowindow closed
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker(null);
        });
    }
}

//i get some help from github and by searching in google to complete this part's methods&function
// VM ViewModel
var AppViewModel = function () {
    //vm variables
    var self = this;
    self.details = ko.observable();
    self.title = ko.observable();
    self.locations = ko.observable(locations);
    self.click = function (locations, marker, locationMark) {
        map.setZoom(10);// zoom when name is clicked from the list
        map.setCenter(locations.location);// this to center the markers in map
        google.maps.event.trigger(locations.locationMark, 'click');//it happend when i clicked
    };
    self.query = ko.observable('');
    //for search filtering
    self.search = ko.computed(function () {
        var newArray = ko.utils.arrayFilter(self.locations(), function (place) {
            if (place.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                if (place.locationMark) {
                    place.locationMark.setVisible(true);
                }
                return true;
            } else {
                place.locationMark.setVisible(false);
            }
        });
        return newArray;
    });
};
//handle error of google map
var MapError = function () {
    alert('Could not load Google Map. Try again later');
};
