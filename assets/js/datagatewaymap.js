var map, 
	tractboundsSearch = [],
	neighborhoodsSearch = [];

/* Metadata and custom color ramps */

var darkorange = '#E66101';
var lightorange = '#FDB863';
var lightpurple = '#B2ABD2';
var darkpurple = '#5E3C99';
var grey = '#CCCCCC';
var lightyellow = '#FFFFCC';
var lightgreen = '#A1DAB4';
var lightblue = '#41B6C4';
var darkblue = '#225EA8';

var meta = {
		neighborhoods: {indname: "Neighborhood Boundaries", description: "Municipalities, Census Designated Places, and City of St. Louis neighborhood boundaries",numclasses: 0, breaks: [], colors: [], labtext: []},
		tractbounds: {indname: "Census Tract Boundaries", description: "2010 Census Tract Boundaries",numclasses: 0, breaks: [], colors: [], labtext: []},
		popden: {indname: "Population Density", description: "Total population from the 2010 Census divided by number of square miles in Census Tract, neighborhood, or municipality.",numclasses: 4, breaks: ['d>6000', 'd>4000', 'd>2000'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 6,000 per sqmi','4,001 - 6,000 per sqmi', '2,001 - 4,000 per sqmi', 'Up to 2,000 per sqmi' ]},
		pctyouth: {indname: "Percent Youth Under 18", description: "Youth under 18 as a percent of the total population from the 2010 Census",numclasses:4, breaks: ['d>30', 'd>25', 'd>15'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 30%', '25.1% - 30%', '15.1% - 25%', 'Up to 15%']},
		pctseniors: {indname: "Percent Seniors Over 65", description: "Seniors over 65 as a percent of the total population from the 2010 Census",numclasses:4, breaks: ['d>20', 'd>15', 'd>10'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 20%', '15.1% - 20%', '10.1% - 15%', 'Up to 10%']},
		pctwhite: {indname: "Percent White", description: "Percent population identifying as white from the 2010 Census",numclasses:4, breaks: ['d>75', 'd>50', 'd>25'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 75%', '50.1% - 75%', '25.1% - 50%', 'Up to 25%']},
		pctblack: {indname: "Percent Black/African American", description: "Percent population identifying as Black or African American from the 2010 Census",numclasses:4, breaks: ['d>75', 'd>50', 'd>25'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 75%', '50.1% - 75%', '25.1% - 50%', 'Up to 25%']},
		pctasian: {indname: "Percent Asian", description: "Percent population identifying as Asian from the 2010 Census",numclasses:4, breaks: ['d>15', 'd>10', 'd>5'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 15%', '10.1% - 15%', '5.1% - 10%', 'Up to 5%']},
		pcthispanic: {indname: "Percent Hispanic", description: "Percent population identifying as Hispanic from the 2010 Census",numclasses:4, breaks: ['d>15', 'd>10', 'd>5'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 15%', '10.1% - 15%', '5.1% - 10%', 'Up to 5%']},
		pctowner: {indname: "Percent Owner-Occupied Units", description: "Percent Owner-Occupied Housing Units from the 2010 Census",numclasses:4, breaks: ['d>60', 'd>40', 'd>20'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 60%', '40.1% - 60%', '20.1% - 40%', 'Up to 20%']},
		pctvacant: {indname: "Percent Vacant Units", description: "Percent Vacant Housing Units from the 2010 Census",numclasses:4, breaks: ['d>30', 'd>20', 'd>10'], colors: [darkblue, lightblue, lightgreen, lightyellow], labtext: ['Over 30%', '20.1% - 30%', '10.1% - 20%', 'Up to 10%']},
		l_restaurant: {indname: "Restaurant Leakage", description: "Leakage is a monetary measure of what occurs when the purchasing power of residents is not matched by products and services offered within a certain area (such as a neighborhood). This means that residents must leave the neighborhood in order to obtain those products and services, and business revenues are not captured within the neighborhood.<br /><br />Restaurant leakage is determined by subtracting annual sales revenue on apparel from residents’ estimated expenditures on food and beverage at restaurants with a certain area (municipality, neighborhood, or zip code). Restaurants are defined by NAICS codes 722511, Full-Service Restaurants, and 722513, Limited-Service Restaurants (carry out). Limited-Service includes a variety of establishments from takeout sandwich and pizza shops to fast food.<br/><br />A positive amount of leakage means that residents are spending more than area restaurants are generating in sales revenue. This means that residents are spending their dollars on eating out outside the area or neighborhood. Negative leakage means that area restaurants are generating more in sales revenue than residents are spending. This means that restaurants are drawing in people from outside the area or neighborhood.", numclasses: 5, breaks:['d==null', 'd>3000000', 'd>0', 'd>-3000000'], colors: [grey, darkpurple, lightpurple, lightorange, darkorange], labtext: ['No data available', 'Leaking spending > $3M', 'Leaking spending up to $3M', 'Attracting spending up to $3M', 'Attracting spending > $3M']},
		l_apparel: {indname: "Apparel Leakage", description: "Leakage is a monetary measure of what occurs when the purchasing power of residents is not matched by products and services offered within a certain area (such as a neighborhood). This means that residents must leave the neighborhood in order to obtain those products and services, and business revenues are not captured within the neighborhood.<br /><br />Apparel leakage is determined by subtracting annual sales revenue on apparel from residents’ estimated expenditures on apparel within a certain area (municipality, neighborhood, or zip code). Apparel is defined as any business under NAICS code 4481, which includes men’s, women’s, and children’s clothing stores, clothing accessories stores, etc.<br /><br />A positive amount of leakage means that residents are spending more than area businesses are generating in sales revenue on apparel. This means that residents are spending their dollars elsewhere (outside the area or neighborhood). Negative leakage means that area businesses are generating more in sales revenue on apparel than residents are spending. This means that businesses are drawing in shoppers from outside the area or neighborhood.",numclasses: 5, breaks: ['d==null', 'd>3000000', 'd>0', 'd>-3000000'],colors: [grey, darkpurple, lightpurple, lightorange, darkorange],labtext:['No data available', 'Leaking spending > $3M', 'Leaking spending up to $3M', 'Attracting spending up to $3M', 'Attracting spending > $3M']},
		l_grocery: {indname: "Grocery Leakage", description: "Leakage is a monetary measure of what occurs when the purchasing power of residents is not matched by products and services offered within a certain area (such as a neighborhood). This means that residents must leave the neighborhood in order to obtain those products and services, and business revenues are not captured within the neighborhood.<br /><br />Grocery leakage is determined by subtracting annual sales at full-service grocers (stores that offer fruits, vegetables, dairy, meat, and breads) from residents’ estimated expenditures on groceries within a certain area (municipality, neighborhood, or zip code). This measure currently defines full-service grocers by NAICS code 45110, Supermarkets and Other Grocery (Except Convenience) Stores.<br /><br />  A positive amount of leakage means that residents’ estimated expenditures exceed grocers’ revenue. This likely means that residents do not have adequate access to fresh food within their neighborhood. Negative leakage means that grocers are generating more in revenue than residents are spending. This means that these grocery stores are attracting shoppers from within and beyond the area or neighborhood.",numclasses: 5, breaks: ['d==null', 'd>5000000', 'd>0', 'd>-5000000'], colors: [grey, darkpurple, lightpurple, lightorange, darkorange], labtext: ['No data available', 'Leaking spending > $5M', 'Leaking spending up to $5M', 'Attracting spending up to $5M', 'Attracting spending > $5M']}
		};	


		
/* Function to get color depending on metadata */

function getColor(d,vname) {		
	var numclasses = meta[vname].numclasses;
	var colors = meta[vname].colors;
	var breaks = meta[vname].breaks;
	var i;
	for (i=0; i < (numclasses-1); i++) {
        if (eval(breaks[i])) {
            return colors[i];
        }
    }
    return colors[(numclasses-1)];
}	


/* Rounding currency */

Number.prototype.formatMoney = function(c, d, t){
			var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "&#8209;" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
			return s + "&dollar;" + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		};
		
function noNaN( n ) { return isNaN( n ) ? 0 : n; } 

	
/* Switcher function for changing geographies */	
	
	
	
	function switchgeo(layerson, layersoff) {

		for (var i = 0; i < layerson.length; i++) {			
			layerControl.addBaseLayer(layerson[i].layer, layerson[i].name);			
			}
		for (var j = 0; j < layersoff.length; j++) {
			layerControl.removeLayer(layersoff[j].layer, layersoff[j].name);  
			map.removeLayer(layersoff[j].layer);
			}
		map.addLayer(layerson[0].layer);
	}
	
/* Basemap Layers */
var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/risestl.i1gom766/{z}/{x}/{y}.png', {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

/* neighborhood popup function */

function neighborhoodpopup (feature, layer) {
   if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" 
	  + "<tr><th>Population per Square Mile</th><td>" + Math.round(((feature.properties.sm_TtPp)/(feature.properties.sqmi)))
	  + "<tr><th>Percent Youth</th><td>" + noNaN(Math.round(((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Seniors</th><td>"  + noNaN(Math.round(((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)) + "%"
	  + "<tr><th>Percent White</th><td>"  + noNaN(Math.round(((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Black/African American</th><td>"  + noNaN(Math.round(((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Asian</th><td>"  + noNaN(Math.round(((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Hispanic</th><td>"  + noNaN(Math.round(((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Owner-Occupied Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)) + "%" 
	  + "<tr><th>Percent Vacant Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)) + "%" 	  
      + "<tr><th>Grocery Leakage</th><td>" + feature.properties.l_grocery.formatMoney(0, '.', ',') 
	  + "<tr><th>Restaurant Leakage</th><td>" + feature.properties.l_restaurant.formatMoney(0, '.', ',') 
	  + "<tr><th>Apparel Leakage</th><td>" + feature.properties.l_apparel.formatMoney(0, '.', ',') 
      + "</td></tr><table>";

      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.NAME);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
          }
        });

      } else {
        layer.bindPopup(content, {
          maxWidth: "auto",
          closeButton: false
        });
      }
}
}


/* tract popup function */

function tractpopup (feature, layer) {
   if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      + "<tr><th>Census Tract</th><td>" + feature.properties.NAME10 + "</td></tr>" 
	  + "<tr><th>Population per Square Mile</th><td>" + Math.round(((feature.properties.sm_TtPp)/(feature.properties.sqmi)))
	  + "<tr><th>Percent Youth</th><td>" + noNaN(Math.round(((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Seniors</th><td>"  + noNaN(Math.round(((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent White</th><td>"  + noNaN(Math.round(((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Black/African American</th><td>"  + noNaN(Math.round(((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Asian</th><td>"  + noNaN(Math.round(((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Hispanic</th><td>"  + noNaN(Math.round(((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)) + "%" 
	  + "<tr><th>Percent Owner-Occupied Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)) + "%" 
	  + "<tr><th>Percent Vacant Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)) + "%" 
      + "<tr><th>Grocery Leakage</th><td>" + feature.properties.l_grocery.formatMoney(0, '.', ',') 
	  + "<tr><th>Restaurant Leakage</th><td>" + feature.properties.l_restaurant.formatMoney(0, '.', ',') 
	  + "<tr><th>Apparel Leakage</th><td>" + feature.properties.l_apparel.formatMoney(0, '.', ',') 
      + "</td></tr><table>";

      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.NAME10);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
          }
        });

      } else {
        layer.bindPopup(content, {
          maxWidth: "auto",
          closeButton: false
        });
      }
}
}

/* Overlay Layers */

var neighborhoods = L.geoJson(null, {
  style: function (feature) {
    return {
      color: 'black',
      fill: false,
      opacity: 1,
    weight: 2,
    dashArray: '3',
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    neighborhoodsSearch.push({
      name: layer.feature.properties.NAME,
      source: "Neighborhoods",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  
  }
});
$.getJSON("data/neighborhoods_bbox.json", function (data) {
  neighborhoods.addData(data);
});

var tractbounds = L.geoJson(null, {
  style: function (feature) {
    return {
      color: 'black',
      fill: false,
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    tractboundsSearch.push({
      name: layer.feature.properties.NAME10,
      source: "Tracts",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
	
  }
});
$.getJSON("data/tractbounds_bbox.json", function (data) {
  tractbounds.addData(data);
});




/* Grocery Leakage */

var n_l_grocery = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(feature.properties.l_grocery, "l_grocery")
    };
  },
    onEachFeature: neighborhoodpopup
});

var t_l_grocery = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(feature.properties.l_grocery, "l_grocery")
    };
  },
    onEachFeature: tractpopup
});


/* Restaurant Leakage */

var n_l_restaurant = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(feature.properties.l_restaurant, "l_restaurant")
    };
  },
    onEachFeature: neighborhoodpopup
});

var t_l_restaurant = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(feature.properties.l_restaurant, "l_restaurant")
    };
  },
    onEachFeature: tractpopup
});

/* Apparel Leakage */

var n_l_apparel = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(feature.properties.l_apparel, "l_apparel")
    };
  },
    onEachFeature: neighborhoodpopup
});


var t_l_apparel = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(feature.properties.l_apparel, "l_apparel")
    };
  },
    onEachFeature: tractpopup
});


/* Population Density */

var n_popden = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(((feature.properties.sm_TtPp)/(feature.properties.sqmi)), "popden")
    };
  },
  onEachFeature: neighborhoodpopup
});

var t_popden = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(((feature.properties.sm_TtPp)/(feature.properties.sqmi)), "popden")
    };
  },
   onEachFeature: tractpopup
});


/* Youth */

var n_pctyouth = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)), "pctyouth")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pctyouth = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)), "pctyouth")
    };
  },
   onEachFeature: tractpopup
});


/* Seniors */


var n_pctseniors = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)), "pctseniors")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pctseniors = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)), "pctseniors")
    };
  },
   onEachFeature: tractpopup
});

/* Percent White Alone */

var n_pctwhite = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)), "pctwhite")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pctwhite = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)), "pctwhite")
    };
  },
   onEachFeature: tractpopup
});

/* Percent Black Alone */

var n_pctblack = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)), "pctblack")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pctblack = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)), "pctblack")
    };
  },
   onEachFeature: tractpopup
});

/* Percent Asian Alone */

var n_pctasian = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)), "pctasian")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pctasian = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)), "pctasian")
    };
  },
   onEachFeature: tractpopup
});

/* Percent Hispanic */

var n_pcthispanic = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)), "pcthispanic")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pcthispanic = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)), "pcthispanic")
    };
  },
   onEachFeature: tractpopup
});

/* Owner Occupied */


var n_pctowner = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)), "pctowner")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pctowner = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)), "pctowner")
    };
  },
   onEachFeature: tractpopup
});

/* Vacant */


var n_pctvacant = L.geoJson(neighborhooddata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)), "pctvacant")
    };
  },
   onEachFeature: neighborhoodpopup
});


var t_pctvacant = L.geoJson(tractdata, {
  style: function (feature) {
    return {
      color: 'black',
      opacity: 1,
	  weight: 2,
	  dashArray: '3',
	  fillOpacity: 0.5,
	  fillColor: getColor(noNaN((((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)), "pctvacant")
    };
  },
   onEachFeature: tractpopup
});


/* Initiate map */

map = L.map("map", {
  zoom: 14,
  // center: [38.65, -90.2],
  center: [38.585, -90.231],
  layers: [mapboxTiles]
});

/* Larger screens get expanded layer control */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var tractlayers = [
		{"layer": t_popden, "name":"Population Density"},
		{"layer": t_pctyouth, "name":"Percent Youth Under 18"},
		{"layer": t_pctseniors, "name":"Percent Seniors Over 65"},
		{"layer": t_pctwhite, "name":"Percent White"},
		{"layer": t_pctblack, "name":"Percent Black/African American"},
		{"layer": t_pctasian, "name":"Percent Asian"},
		{"layer": t_pcthispanic, "name":"Percent Hispanic"},
		{"layer": t_pctowner, "name":"Percent Owner-Occupied Units"},
		{"layer": t_pctvacant, "name":"Percent Vacant Units"},
		{"layer": t_l_grocery, "name":"Grocery Leakage"},
		{"layer": t_l_restaurant, "name":"Restaurant Leakage"},
		{"layer": t_l_apparel, "name":"Apparel Leakage"}
		
		];
  
var neighborhoodlayers = [
		{"layer": n_popden, "name":"Population Density"},
		{"layer": n_pctyouth, "name":"Percent Youth Under 18"},
		{"layer": n_pctseniors, "name":"Percent Seniors Over 65"},
		{"layer": n_pctwhite, "name":"Percent White"},
		{"layer": n_pctblack, "name":"Percent Black/African American"},
		{"layer": n_pctasian, "name":"Percent Asian"},
		{"layer": n_pcthispanic, "name":"Percent Hispanic"},
		{"layer": n_pctowner, "name":"Percent Owner-Occupied Units"},
		{"layer": n_pctvacant, "name":"Percent Vacant Units"},
		{"layer": n_l_grocery, "name":"Grocery Leakage"},
		{"layer": n_l_restaurant, "name":"Restaurant Leakage"},
		{"layer": n_l_apparel, "name":"Apparel Leakage"}

		];

var baselayers ={"Population Density": t_popden, "Percent Youth Under 18": t_pctyouth, "Percent Seniors Over 65": t_pctseniors, "Percent White": t_pctwhite, "Percent Black/African American": t_pctblack, "Percent Asian": t_pctasian, "Percent Hispanic": t_pcthispanic, "Percent Owner-Occupied Units": t_pctowner, "Percent Vacant Units": t_pctvacant, "Grocery Leakage":t_l_grocery, "Restaurant Leakage": t_l_restaurant, "Apparel Leakage": t_l_apparel};
var overlays = {};

var layerControl = L.control.layers(baselayers, overlays, {
  collapsed: isCollapsed
});


map.addControl(layerControl);
map.addLayer(t_popden);


/* Sidebar Legend (changes with base layer change) */


map.on('baselayerchange', function(a) {
	var legendhtml;
	var layervarname;	
		for (var key in meta) {
  if (meta.hasOwnProperty(key)) {
  	if (meta[key].indname === a.name){
  		layervarname = key;
  	}
  }
}
	
		var numclasses = meta[layervarname].numclasses;
			var colors = meta[layervarname].colors;
			var labtext = meta[layervarname].labtext;
			labels = [];
				
			for (var i = 0; i < numclasses; i++) {

				labels.push(
					'<i style="background:' + colors[i] + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i> ' +
					labtext[i]);
			}

			
			legendhtml = '<h3>Legend</h3><hr /><h4>' + a.name + '</h4>' + labels.join('<br>') + '<hr /> <h4>Description</h4>' + meta[layervarname].description;

	
	
    sidebar.setContent(legendhtml );
	
});



/* Add Sidebar */

var sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left"
}).addTo(map);


/* visible sidebar on start */

sidebar.show();


/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  // map.fitBounds(tractbounds.getBounds());
  $("#loading").hide();


  var tractboundsBH = new Bloodhound({
    name: "Tracts",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: tractboundsSearch,
    limit: 10
  });
  
var neighborhoodsBH = new Bloodhound({
    name: "Neighborhoods",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: neighborhoodsSearch,
    limit: 10
  });

  neighborhoodsBH.initialize();
  tractboundsBH.initialize();


  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Tracts",
    displayKey: "name",
    source: tractboundsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Tracts</h4>"
    }
  }, {
    name: "Neighborhoods",
    displayKey: "name",
    source: neighborhoodsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Neighborhoods</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
	if (datum.source === "Tracts") {
      map.fitBounds(datum.bounds);
    }
	if (datum.source === "Neighborhoods") {
      map.fitBounds(datum.bounds);
    }
    
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});





	
	
/* Placeholder hack for IE */
if (navigator.appName == "Microsoft Internet Explorer") {
  $("input").each(function () {
    if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
      $(this).val($(this).attr("placeholder"));
      $(this).focus(function () {
        if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
      });
      $(this).blur(function () {
        if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
      });
    }
  });
}
