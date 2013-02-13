/*
 * jQuery UI addresspicker @VERSION
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.ui.autocomplete.js
 */
(function( $, undefined ) {
	$.widget( "ui.addresspicker", {
		options: {
			appendAddressString: "",
			draggableMarker: true,
			regionBias: null,
			mapOptions: {
				zoom: 5, 
				center: new google.maps.LatLng(45.889042, 6.23809499999993),
				scrollwheel: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			},
			elements: {
				map: false,
                lat: false,
                lng: false,
                type: false,
                long_names: {
                    street_number: false,
                    route: false,
                    intersection: false,
                    locality: false,
                    political: false,
                    administrative_area_level_3: false,
                    administrative_area_level_2: false,
                    administrative_area_level_1: false,
                    country: false,
                    postal_code: false,
                    colloquial_area: false,
                    sublocality: false,
                    neighborhood: false,
                    premise: false,
                    subpremise: false,
                    natural_feature: false,
                    airport: false,
                    park: false,
                    point_of_interest: false
                },
                short_names : {
                    street_number: false,
                    route: false,
                    intersection: false,
                    locality: false,
                    political: false,
                    administrative_area_level_3: false,
                    administrative_area_level_2: false,
                    administrative_area_level_1: false,
                    country: false,
                    postal_code: false,
                    colloquial_area: false,
                    sublocality: false,
                    neighborhood: false,
                    premise: false,
                    subpremise: false,
                    natural_feature: false,
                    airport: false,
                    park: false,
                    point_of_interest: false
                }
			}
		},

		marker: function() {
			return this.gmarker;
		},

		map: function() {
			return this.gmap;
		},

		updatePosition: function() {
			this._updatePosition(this.gmarker.getPosition());
		},

		reloadPosition: function() {
			this.gmarker.setVisible(true);
			this.gmarker.setPosition(new google.maps.LatLng(this.lat.val(), this.lng.val()));
			this.gmap.setCenter(this.gmarker.getPosition());
		},

		selected: function() {
			return this.selectedResult;
		},

		_create: function() {
			this.geocoder = new google.maps.Geocoder();
			this.element.autocomplete({
				source: $.proxy(this._geocode, this),  
				focus:  $.proxy(this._focusAddress, this),
				select: $.proxy(this._selectAddress, this)
			});

            // Long_names
            this.street_number                  = $(this.options.elements.long_names.street_number);
            this.route                          = $(this.options.elements.long_names.route);
            this.intersection                   = $(this.options.elements.long_names.intersection);
            this.locality                       = $(this.options.elements.long_names.locality);
            this.political                      = $(this.options.elements.long_names.political);
            this.administrative_area_level_3    = $(this.options.elements.long_names.administrative_area_level_3);
            this.administrative_area_level_2    = $(this.options.elements.long_names.administrative_area_level_2);
            this.administrative_area_level_1    = $(this.options.elements.long_names.administrative_area_level_1);
            this.country                        = $(this.options.elements.long_names.country);
            this.postal_code                    = $(this.options.elements.long_names.postal_code);
            this.colloquial_area                = $(this.options.elements.long_names.colloquial_area);
            this.sublocality                    = $(this.options.elements.long_names.sublocality);
            this.neighborhood                   = $(this.options.elements.long_names.neighborhood);
            this.premise                        = $(this.options.elements.long_names.premise);
            this.subpremise                     = $(this.options.elements.long_names.subpremise);
            this.natural_feature                = $(this.options.elements.long_names.natural_feature);
            this.airport                        = $(this.options.elements.long_names.airport);
            this.park                           = $(this.options.elements.long_names.park);
            this.point_of_interest              = $(this.options.elements.long_names.point_of_interest);

            // Short_names
            this.street_number_s                  = $(this.options.elements.short_names.street_number);
            this.route_s                          = $(this.options.elements.short_names.route);
            this.intersection_s                   = $(this.options.elements.short_names.intersection);
            this.locality_s                       = $(this.options.elements.short_names.locality);
            this.political_s                      = $(this.options.elements.short_names.political);
            this.administrative_area_level_3_s    = $(this.options.elements.short_names.administrative_area_level_3);
            this.administrative_area_level_2_s    = $(this.options.elements.short_names.administrative_area_level_2);
            this.administrative_area_level_1_s    = $(this.options.elements.short_names.administrative_area_level_1);
            this.country_s                        = $(this.options.elements.short_names.country);
            this.postal_code_s                    = $(this.options.elements.short_names.postal_code);
            this.colloquial_area_s                = $(this.options.elements.short_names.colloquial_area);
            this.sublocality_s                    = $(this.options.elements.short_names.sublocality);
            this.neighborhood_s                   = $(this.options.elements.short_names.neighborhood);
            this.premise_s                        = $(this.options.elements.short_names.premise);
            this.subpremise_s                     = $(this.options.elements.short_names.subpremise);
            this.natural_feature_s                = $(this.options.elements.short_names.natural_feature);
            this.airport_s                        = $(this.options.elements.short_names.airport);
            this.park_s                           = $(this.options.elements.short_names.park);
            this.point_of_interest_s              = $(this.options.elements.short_names.point_of_interest);

            // others
            this.lat                            = $(this.options.elements.lat);
            this.lng                            = $(this.options.elements.lng);
            this.type                           = $(this.options.elements.type);

            if (this.options.elements.map) {
				this.mapElement = $(this.options.elements.map);
				this._initMap();
			}
		},

		_initMap: function() {
			if (this.lat && this.lat.val()) {
				this.options.mapOptions.center = new google.maps.LatLng(this.lat.val(), this.lng.val());
			}

			this.gmap = new google.maps.Map(this.mapElement[0], this.options.mapOptions);
			this.gmarker = new google.maps.Marker({
				position: this.options.mapOptions.center, 
				map:this.gmap, 
				draggable: this.options.draggableMarker});
			google.maps.event.addListener(this.gmarker, 'dragend', $.proxy(this._markerMoved, this));
			this.gmarker.setVisible(false);
		},

		_updatePosition: function(location) {
			if (this.lat) {
				this.lat.val(location.lat());
			}
			if (this.lng) {
				this.lng.val(location.lng());
			}
		},

		_markerMoved: function() {
			this._updatePosition(this.gmarker.getPosition());
		},

		// Autocomplete source method: fill its suggests with google geocoder results
		_geocode: function(request, response) {
			var address = request.term, self = this;
			this.geocoder.geocode({
				'address': address + this.options.appendAddressString,
				'region': this.options.regionBias
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					for (var i = 0; i < results.length; i++) {
						results[i].label =  results[i].formatted_address;
					};
				} 
				response(results);
			})
		},

		_findInfo: function(result, type, short_name) {
            short_name = typeof short_name !== 'undefined' ? short_name : false;
            for (var i = 0; i < result.address_components.length; i++) {
				var component = result.address_components[i];
				if (component.types.indexOf(type) !=-1) {
					if(short_name === true)
                        return component.short_name;
                    return component.long_name;
				}
			}
			return false;
		},

		_focusAddress: function(event, ui) {
			var address = ui.item;
			if (!address) {
				return;
			}
		  
			if (this.gmarker) {
				this.gmarker.setPosition(address.geometry.location);
				this.gmarker.setVisible(true);
				this.gmap.fitBounds(address.geometry.viewport);
			}
			this._updatePosition(address.geometry.location);
		  
			// Long names
            if (this.street_number) {
				this.street_number.val(this._findInfo(address, 'street_number'));
			}
			if (this.route) {
				this.route.val(this._findInfo(address, 'route'));
			}
			if (this.intersection) {
				this.intersection.val(this._findInfo(address, 'intersection'));
			}
			if (this.locality) {
				this.locality.val(this._findInfo(address, 'locality'));
			}
            if (this.administrative_area_level_3) {
                this.administrative_area_level_3.val(this._findInfo(address, 'administrative_area_level_3'));
            }
			if (this.administrative_area_level_2) {
				this.administrative_area_level_2.val(this._findInfo(address, 'administrative_area_level_2'));
			}
			if (this.administrative_area_level_1) {
				this.administrative_area_level_1.val(this._findInfo(address, 'administrative_area_level_1'));
			}
			if (this.country) {
				this.country.val(this._findInfo(address, 'country'));
			}
			if (this.postal_code) {
				this.postal_code.val(this._findInfo(address, 'postal_code'));
			}
            if (this.political) {
                this.political.val(this._findInfo(address, 'political'));
            }
            if (this.colloquial_area) {
                this.colloquial_area.val(this._findInfo(address, 'colloquial_area'));
            }
            if (this.sublocality) {
                this.sublocality.val(this._findInfo(address, 'sublocality'));
            }
            if (this.neighborhood) {
                this.neighborhood.val(this._findInfo(address, 'neighborhood'));
            }
            if (this.premise) {
                this.premise.val(this._findInfo(address, 'premise'));
            }
            if (this.subpremise) {
                this.subpremise.val(this._findInfo(address, 'subpremise'));
            }
            if (this.natural_feature) {
                this.natural_feature.val(this._findInfo(address, 'natural_feature'));
            }
            if (this.airport) {
                this.airport.val(this._findInfo(address, 'airport'));
            }
            if (this.park) {
                this.park.val(this._findInfo(address, 'park'));
            }
            if (this.point_of_interest) {
                this.point_of_interest.val(this._findInfo(address, 'point_of_interest'));
            }

            // Short names
            if (this.street_number_s) {
                this.street_number_s.val(this._findInfo(address, 'street_number', true));
            }
            if (this.route_s) {
                this.route_s.val(this._findInfo(address, 'route', true));
            }
            if (this.intersection_s) {
                this.intersection_s.val(this._findInfo(address, 'intersection', true));
            }
            if (this.locality_s) {
                this.locality_s.val(this._findInfo(address, 'locality', true));
            }
            if (this.administrative_area_level_3_s) {
                this.administrative_area_level_3_s.val(this._findInfo(address, 'administrative_area_level_3', true));
            }
            if (this.administrative_area_level_2_s) {
                this.administrative_area_level_2_s.val(this._findInfo(address, 'administrative_area_level_2', true));
            }
            if (this.administrative_area_level_1_s) {
                this.administrative_area_level_1_s.val(this._findInfo(address, 'administrative_area_level_1', true));
            }
            if (this.country_s) {
                this.country_s.val(this._findInfo(address, 'country', true));
            }
            if (this.postal_code_s) {
                this.postal_code_s.val(this._findInfo(address, 'postal_code', true));
            }
            if (this.political_s) {
                this.political_s.val(this._findInfo(address, 'political', true));
            }
            if (this.colloquial_area_s) {
                this.colloquial_area_s.val(this._findInfo(address, 'colloquial_area', true));
            }
            if (this.sublocality_s) {
                this.sublocality_s.val(this._findInfo(address, 'sublocality', true));
            }
            if (this.neighborhood_s) {
                this.neighborhood_s.val(this._findInfo(address, 'neighborhood', true));
            }
            if (this.premise_s) {
                this.premise_s.val(this._findInfo(address, 'premise', true));
            }
            if (this.subpremise_s) {
                this.subpremise_s.val(this._findInfo(address, 'subpremise', true));
            }
            if (this.natural_feature_s) {
                this.natural_feature_s.val(this._findInfo(address, 'natural_feature', true));
            }
            if (this.airport_s) {
                this.airport_s.val(this._findInfo(address, 'airport', true));
            }
            if (this.park_s) {
                this.park_s.val(this._findInfo(address, 'park', true));
            }
            if (this.point_of_interest_s) {
                this.point_of_interest_s.val(this._findInfo(address, 'point_of_interest', true));
            }

            // Others
            if (this.type) {
                this.type.val(address.types[0]);
            }
		},

		_selectAddress: function(event, ui) {
			this.selectedResult = ui.item;
		}
		});

		$.extend( $.ui.addresspicker, {
			version: "@VERSION"
		});

		// make IE think it doesn't suck
		if(!Array.indexOf){
			Array.prototype.indexOf = function(obj){
				for(var i=0; i<this.length; i++){
					if(this[i]==obj){
						return i;
					}
				}
				return -1;
			}
		}
})( jQuery );
