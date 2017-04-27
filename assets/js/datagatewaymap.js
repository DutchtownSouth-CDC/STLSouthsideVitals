var map,
    tractboundsSearch = [],
    neighborhoodsSearch = [],
    parcelSearch = [];


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
var transparent = 'rgba(0,0,0,0)';

var darkorange = '#E66101';
var lightorange = '#FDB863';
var lightpurple = '#B2ABD2';
var darkpurple = '#5E3C99';
var grey = '#CCCCCC';
var lightyellow = '#FFFFCC';
var lightgreen = '#A1DAB4';
var lightblue = '#41B6C4';
var darkblue = '#225EA8';
var transparent = 'rgba(0,0,0,0)';


var red = '#e41a1c';
var blue = '#377eb8';
var green = '#4daf4a';
var purple = '#984ea3';
var orange = '#ff7f00';

var teal = '#1b9e77';
var deeporange = '#d95f02';
var violet = '#7570b3';
var magenta = '#e7298a';
var olivegreen = '#66a61e';

var meta = {
    neighborhoods: {
        indname: "Neighborhood Boundaries",
        description: "Municipalities, Census Designated Places, and City of St. Louis neighborhood boundaries",
        numclasses: 0,
        breaks: [],
        colors: [],
        labtext: []
    },
    tractbounds: {
        indname: "Census Tract Boundaries",
        description: "2010 Census Tract Boundaries",
        numclasses: 0,
        breaks: [],
        colors: [],
        labtext: []
    },
    foreclosed: {
        indname: "Foreclosed Homes",
        description: "Total population from the 2010 Census divided by number of square miles in Census Tract, neighborhood, or municipality.",
        numclasses: 2,
        breaks: ['d==="Y"'],
        colors: [green, grey],
        labtext: ['Foreclosed Properties']
    },
    ownerocc: {
        indname: "Owner Occupied",
        description: "Youth under 18 as a percent of the total population from the 2010 Census",
        numclasses: 2,
        breaks: ['d==="Y"'],
        colors: [darkorange, grey],
        labtext: ['Owner Occupied', 'not owner occupied']
    },
    condemed: {
        indname: "Condemned",
        description: "Seniors over 65 as a percent of the total population from the 2010 Census",
        numclasses: 2,
        breaks: ['d==="Y"'],
        colors: [darkblue, grey],
        labtext: ['units condemned']
    },
    age: {
        indname: "Housing Age by Decade",
        description: "Percent population identifying as white from the 2010 Census",
        numclasses: 12,
        breaks: ['d==0','d>2000', 'd>1990', 'd>1980', 'd>1970', 'd>1960', 'd>1950', 'd>1940', 'd>1930', 'd>1920', 'd>1910', 'd>1900'],
        colors: [grey, darkblue, lightblue, lightgreen, lightyellow, olivegreen, magenta, deeporange, red, orange, teal, purple ],
        labtext: ['no year','2000-2009', '1990-1999', '1980-1989', '1970-1979', '1960-1969', '1950-1959', '1940-1949', '1930-1939', '1920-1929', '1919-1910', '1909-1900', 'before 1900']
    },
    backtaxes: {
        indname: "Homes sold for backtaxes",
        description: "Housing sold for backtaxes",
        numclasses: 2,
        breaks: ['d==="Y"'],
        colors: [magenta, grey],
        labtext: ['Sold for Backtaxes']
    },
    zoning: {
        indname: "Land Use",
        description: "Parcels shaded by land use",
        numclasses: 6,
        breaks: ['d=="A"', 'd=="B"', 'd=="C"', 'd=="H"', 'd=="J"', 'd=="K"'],
        colors: [magenta, olivegreen, red, blue, darkorange, green],
        labtext: ['Single Family Residential', 'Two Family Residential', 'Multi-family', 'Commercial', 'Industrial', 'Unrestricted']
    },
    lravac: {
        indname: "LRA Vacant Lots",
        description: "Vacant Lots owned by LRA",
        numclasses: 2,
        breaks: ['d==="Y"'],
        colors: [orange, grey],
        labtext: ['LRA owned vacant lots']
    },
    appraisal: {
        indname: "Appraisal Value",
        description: "Percent Owner-Occupied Housing Units from the 2010 Census",
        numclasses: 7,
        breaks: ['d>500000', 'd>200000', 'd>150000', 'd>100000', 'd>75000', 'd>50000'],
        colors: [darkblue, lightblue, green, lightgreen, lightyellow, orange, red],
        labtext: ['Over $500,000', '$200,000 - $500,000', '$150,000 - $199,999', '$100,000 - $149,999', '$75,000-$99,999', '$50,000-$74,999', 'Below $50,000']
    },
    pctvacant: {
        indname: "Percent Vacant Units",
        description: "Percent Vacant Housing Units from the 2010 Census",
        numclasses: 4,
        breaks: ['d>30', 'd>20', 'd>10'],
        colors: [darkblue, lightblue, lightgreen, lightyellow],
        labtext: ['Over 30%', '20.1% - 30%', '10.1% - 20%', 'Up to 10%']
    },
    l_restaurant: {
        indname: "Restaurant Leakage",
        description: "Leakage is a monetary measure of what occurs when the purchasing power of residents is not matched by products and services offered within a certain area (such as a neighborhood). This means that residents must leave the neighborhood in order to obtain those products and services, and business revenues are not captured within the neighborhood.<br /><br />Restaurant leakage is determined by subtracting annual sales revenue on apparel from residents’ estimated expenditures on food and beverage at restaurants with a certain area (municipality, neighborhood, or zip code). Restaurants are defined by NAICS codes 722511, Full-Service Restaurants, and 722513, Limited-Service Restaurants (carry out). Limited-Service includes a variety of establishments from takeout sandwich and pizza shops to fast food.<br/><br />A positive amount of leakage means that residents are spending more than area restaurants are generating in sales revenue. This means that residents are spending their dollars on eating out outside the area or neighborhood. Negative leakage means that area restaurants are generating more in sales revenue than residents are spending. This means that restaurants are drawing in people from outside the area or neighborhood.",
        numclasses: 5,
        breaks: ['d==null', 'd>3000000', 'd>0', 'd>-3000000'],
        colors: [grey, darkpurple, lightpurple, lightorange, darkorange],
        labtext: ['No data available', 'Leaking spending > $3M', 'Leaking spending up to $3M', 'Attracting spending up to $3M', 'Attracting spending > $3M']
    },
    l_apparel: {
        indname: "Apparel Leakage",
        description: "Leakage is a monetary measure of what occurs when the purchasing power of residents is not matched by products and services offered within a certain area (such as a neighborhood). This means that residents must leave the neighborhood in order to obtain those products and services, and business revenues are not captured within the neighborhood.<br /><br />Apparel leakage is determined by subtracting annual sales revenue on apparel from residents’ estimated expenditures on apparel within a certain area (municipality, neighborhood, or zip code). Apparel is defined as any business under NAICS code 4481, which includes men’s, women’s, and children’s clothing stores, clothing accessories stores, etc.<br /><br />A positive amount of leakage means that residents are spending more than area businesses are generating in sales revenue on apparel. This means that residents are spending their dollars elsewhere (outside the area or neighborhood). Negative leakage means that area businesses are generating more in sales revenue on apparel than residents are spending. This means that businesses are drawing in shoppers from outside the area or neighborhood.",
        numclasses: 5,
        breaks: ['d==null', 'd>3000000', 'd>0', 'd>-3000000'],
        colors: [grey, darkpurple, lightpurple, lightorange, darkorange],
        labtext: ['No data available', 'Leaking spending > $3M', 'Leaking spending up to $3M', 'Attracting spending up to $3M', 'Attracting spending > $3M']
    },
    l_grocery: {
        indname: "Grocery Leakage",
        description: "Leakage is a monetary measure of what occurs when the purchasing power of residents is not matched by products and services offered within a certain area (such as a neighborhood). This means that residents must leave the neighborhood in order to obtain those products and services, and business revenues are not captured within the neighborhood.<br /><br />Grocery leakage is determined by subtracting annual sales at full-service grocers (stores that offer fruits, vegetables, dairy, meat, and breads) from residents’ estimated expenditures on groceries within a certain area (municipality, neighborhood, or zip code). This measure currently defines full-service grocers by NAICS code 45110, Supermarkets and Other Grocery (Except Convenience) Stores.<br /><br />  A positive amount of leakage means that residents’ estimated expenditures exceed grocers’ revenue. This likely means that residents do not have adequate access to fresh food within their neighborhood. Negative leakage means that grocers are generating more in revenue than residents are spending. This means that these grocery stores are attracting shoppers from within and beyond the area or neighborhood.",
        numclasses: 5,
        breaks: ['d==null', 'd>5000000', 'd>0', 'd>-5000000'],
        colors: [grey, darkpurple, lightpurple, lightorange, darkorange],
        labtext: ['No data available', 'Leaking spending > $5M', 'Leaking spending up to $5M', 'Attracting spending up to $5M', 'Attracting spending > $5M']
    }
};






/* Function to get color depending on metadata */

function getColor(d, vname) {
    var numclasses = meta[vname].numclasses;
    var colors = meta[vname].colors;
    var breaks = meta[vname].breaks;
    var i;
    for (i = 0; i < (numclasses - 1); i++) {
        if (eval(breaks[i])) {
            return colors[i];
        }
    }
    return colors[(numclasses - 1)];
}


/* Rounding currency */

Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "&#8209;" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + "&dollar;" + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function noNaN(n) {
    return isNaN(n) ? 0 : n; }


/* Switcher function for changing geographies */



// function switchgeo(layerson, layersoff) {

//  for (var i = 0; i < layerson.length; i++) {     
//    layerControl.addBaseLayer(layerson[i].layer, layerson[i].name);     
//    }
//  for (var j = 0; j < layersoff.length; j++) {
//    layerControl.removeLayer(layersoff[j].layer, layersoff[j].name);  
//    map.removeLayer(layersoff[j].layer);
//    }
//  map.addLayer(layerson[0].layer);
// }

/* Basemap Layers */
var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/risestl.i1gom766/{z}/{x}/{y}.png', {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

/* neighborhood popup function */

// function neighborhoodpopup (feature, layer) {
//    if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" 
//       + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" 
//    + "<tr><th>Population per Square Mile</th><td>" + Math.round(((feature.properties.sm_TtPp)/(feature.properties.sqmi)))
//    + "<tr><th>Percent Youth</th><td>" + noNaN(Math.round(((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Seniors</th><td>"  + noNaN(Math.round(((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)) + "%"
//    + "<tr><th>Percent White</th><td>"  + noNaN(Math.round(((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Black/African American</th><td>"  + noNaN(Math.round(((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Asian</th><td>"  + noNaN(Math.round(((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Hispanic</th><td>"  + noNaN(Math.round(((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Owner-Occupied Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)) + "%" 
//    + "<tr><th>Percent Vacant Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)) + "%"     
//       + "<tr><th>Grocery Leakage</th><td>" + feature.properties.l_grocery.formatMoney(0, '.', ',') 
//    + "<tr><th>Restaurant Leakage</th><td>" + feature.properties.l_restaurant.formatMoney(0, '.', ',') 
//    + "<tr><th>Apparel Leakage</th><td>" + feature.properties.l_apparel.formatMoney(0, '.', ',') 
//       + "</td></tr><table>";

//       if (document.body.clientWidth <= 767) {
//         layer.on({

//           click: function (e) {
//             $("#feature-title").html(feature.properties.NAME);
//             $("#feature-info").html(content);
//             $("#featureModal").modal("show");
//           }
//         });

//       } else {
//         layer.bindPopup(content, {
//           maxWidth: "auto",
//           closeButton: false
//         });
//       }
// }
// }


//  tract popup function 

// function tractpopup (feature, layer) {
//    if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" 
//       + "<tr><th>Census Tract</th><td>" + feature.properties.NAME10 + "</td></tr>" 
//    + "<tr><th>Population per Square Mile</th><td>" + Math.round(((feature.properties.sm_TtPp)/(feature.properties.sqmi)))
//    + "<tr><th>Percent Youth</th><td>" + noNaN(Math.round(((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Seniors</th><td>"  + noNaN(Math.round(((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent White</th><td>"  + noNaN(Math.round(((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Black/African American</th><td>"  + noNaN(Math.round(((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Asian</th><td>"  + noNaN(Math.round(((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Hispanic</th><td>"  + noNaN(Math.round(((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)) + "%" 
//    + "<tr><th>Percent Owner-Occupied Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)) + "%" 
//    + "<tr><th>Percent Vacant Units</th><td>"  + noNaN(Math.round(((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)) + "%" 
//       + "<tr><th>Grocery Leakage</th><td>" + feature.properties.l_grocery.formatMoney(0, '.', ',') 
//    + "<tr><th>Restaurant Leakage</th><td>" + feature.properties.l_restaurant.formatMoney(0, '.', ',') 
//    + "<tr><th>Apparel Leakage</th><td>" + feature.properties.l_apparel.formatMoney(0, '.', ',') 
//       + "</td></tr><table>";

//       if (document.body.clientWidth <= 767) {
//         layer.on({
//           click: function (e) {
//             $("#feature-title").html(feature.properties.NAME10);
//             $("#feature-info").html(content);
//             $("#featureModal").modal("show");
//           }
//         });

//       } else {
//         layer.bindPopup(content, {
//           maxWidth: "auto",
//           closeButton: false
//         });
//       }
// }
// }

/* Overlay Layers */



var parcelLayout = L.geoJson(null, {
    style: function(feature) {
        return {
            color: 'blue',
            fill: false,
            opacity: 1,
            weight: 3,
            // dashArray: '3',
//             clickable: false
        };
    },
    onEachFeature: function(feature, layer) {
        parcelSearch.push({
            name: layer.feature.properties.Address,
            source: "Parcels",
            id: L.stamp(layer),
            bounds: layer.getBounds()
        });

    }
});


var dsccneighborhood = L.geoJson(nbhd, {
    style: function(feature) {
        return {
            color: 'black',
            fill: false,
            opacity: 1,
            weight: 2,
            // dashArray: '3',

        };
    },
    onEachFeature: onEachFeature
});


// var neighborhoods = L.geoJson(null, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       fill: false,
//       opacity: 1,
//     weight: 2,
//     dashArray: '3',
//       clickable: false
//     };
//   },
//   onEachFeature: function (feature, layer) {
//     neighborhoodsSearch.push({
//       name: layer.feature.properties.NAME,
//       source: "Neighborhoods",
//       id: L.stamp(layer),
//       bounds: layer.getBounds()
//     });

//   }
// });
// $.getJSON("data/neighborhoods_bbox.json", function (data) {
//   neighborhoods.addData(data);
// });

// var parcels = L.geoJson(null, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       fill: false,
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//       clickable: false
//     };
//   },
//   onEachFeature: function (feature, layer) {
//     parcelSearch.push({
//       name: layer.feature.properties.handle,
//       source: "Parcels",
//       id: L.stamp(layer),
//       bounds: layer.getBounds()
//     });

//   }
// });
// $.getJSON("data/parcels.json", function (data) {
//   parcels.addData(data);
// });




// /* Grocery Leakage */

// var n_l_grocery = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(feature.properties.l_grocery, "l_grocery")
//     };
//   },
//     onEachFeature: neighborhoodpopup
// });

// var t_l_grocery = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(feature.properties.l_grocery, "l_grocery")
//     };
//   },
//     onEachFeature: tractpopup
// });


// /* Restaurant Leakage */

// var n_l_restaurant = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(feature.properties.l_restaurant, "l_restaurant")
//     };
//   },
//     onEachFeature: neighborhoodpopup
// });

// var t_l_restaurant = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(feature.properties.l_restaurant, "l_restaurant")
//     };
//   },
//     onEachFeature: tractpopup
// });

/* Owner Occupied */

var ownerOccupied = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.ownerocc, "ownerocc")
        };
    },
    onEachFeature: onEachFeature
});


var condemned = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            // dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.Condemed, "condemed")
        };
    },
    onEachFeature: onEachFeature
});

var foreclosed = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            // dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.Foreclos_1, "foreclosed")
        };
    },
    onEachFeature: onEachFeature
});

var backtaxes = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            // dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.Backtaxes, "backtaxes")
        };
    },
    onEachFeature: onEachFeature
});

var Lravac = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            // dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.Lravac, "lravac")
        };
    },
    onEachFeature: onEachFeature
});
var zoning = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            // dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.Zoning, "zoning")
        };
    },
    onEachFeature: onEachFeature
});

var appraisal = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            // dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(((feature.properties.Asmt) / .19), "appraisal")
        };
    },
    onEachFeature: onEachFeature
});

var age = L.geoJson(parcels, {
    style: function(feature) {
        return {
            color: 'black',
            opacity: 1,
            weight: 0.5,
            // dashArray: '3',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.Age, "age")
        };
    },
    onEachFeature: onEachFeature
});


// /* Population Density */

// var n_popden = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(((feature.properties.sm_TtPp)/(feature.properties.sqmi)), "popden")
//     };
//   },
//   onEachFeature: neighborhoodpopup
// });

// var t_popden = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(((feature.properties.sm_TtPp)/(feature.properties.sqmi)), "popden")
//     };
//   },
//    onEachFeature: tractpopup
// });


// /* Youth */

// var n_pctyouth = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)), "pctyouth")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pctyouth = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Un18)/(feature.properties.sm_TtPp))*100)), "pctyouth")
//     };
//   },
//    onEachFeature: tractpopup
// });


// /* Seniors */


// var n_pctseniors = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)), "pctseniors")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pctseniors = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Ov65)/(feature.properties.sm_TtPp))*100)), "pctseniors")
//     };
//   },
//    onEachFeature: tractpopup
// });

// /* Percent White Alone */

// var n_pctwhite = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)), "pctwhite")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pctwhite = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Wht1)/(feature.properties.sm_TtPp))*100)), "pctwhite")
//     };
//   },
//    onEachFeature: tractpopup
// });

// /* Percent Black Alone */

// var n_pctblack = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)), "pctblack")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pctblack = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Blc1)/(feature.properties.sm_TtPp))*100)), "pctblack")
//     };
//   },
//    onEachFeature: tractpopup
// });

// /* Percent Asian Alone */

// var n_pctasian = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)), "pctasian")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pctasian = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_Asn1)/(feature.properties.sm_TtPp))*100)), "pctasian")
//     };
//   },
//    onEachFeature: tractpopup
// });

// /* Percent Hispanic */

// var n_pcthispanic = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)), "pcthispanic")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pcthispanic = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_HspP)/(feature.properties.sm_TtPp))*100)), "pcthispanic")
//     };
//   },
//    onEachFeature: tractpopup
// });

// /* Owner Occupied */


// var n_pctowner = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)), "pctowner")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pctowner = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_OwnO)/(feature.properties.sm_Tt_U))*100)), "pctowner")
//     };
//   },
//    onEachFeature: tractpopup
// });

// /* Vacant */


// var n_pctvacant = L.geoJson(neighborhooddata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)), "pctvacant")
//     };
//   },
//    onEachFeature: neighborhoodpopup
// });


// var t_pctvacant = L.geoJson(tractdata, {
//   style: function (feature) {
//     return {
//       color: 'black',
//       opacity: 1,
//    weight: 2,
//    dashArray: '3',
//    fillOpacity: 0.5,
//    fillColor: getColor(noNaN((((feature.properties.sm_VcnU)/(feature.properties.sm_Tt_U))*100)), "pctvacant")
//     };
//   },
//    onEachFeature: tractpopup
// });


/* Initiate map */

var map = L.map('map', {
    center: [38.58308, -90.23806],
    zoom: 15,
    layers: [dsccneighborhood]
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 17,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

// var geojson = L.geoJson(parcels).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = (props ?
        '<b>' + props.Address + '</b><br />' + props.Ownername : 'Hover over a parcel');
};

info.addTo(map);


function style(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'green',
        // dashArray: '3',
        fillOpacity: 0.2,
        // fillColor: getColor(feature.properties.density)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#777',

        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    var layer = e.target;
    layer.resetStyle(e.target);
    info.update();
}



function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());

}


function onEachFeature(feature, layer) {
    var app = (Math.round(((feature.properties.Asmt) / (.19))));
    var assmt = Math.round(feature.properties.Asmt);

    var content = "<table class='table table-striped table-bordered table-condensed'>" 
    + "<tr><th>Address</th><td>" + feature.properties.Address 
    + "<tr><th>Owner Name</th><td>" + feature.properties.Ownername 
    + "<tr><th>Owner City</th><td>" + feature.properties.Ownercity 
    + "<tr><th>Ward</th><td>" + feature.properties.Ward 
    + "<tr><th>Precinct</th><td>" + feature.properties.Precinct 
    + "<tr><th>Year Built</th><td>" + feature.properties.Age 
    + "<tr><th>Assessment</th><td>"  + assmt.formatMoney(0, '.', ',') 
    + "<tr><th>Appraisal</th><td>" + app.formatMoney(0, '.', ',') 
      + "<tr><th>Zoning Class</th><td>" + feature.properties.Zoning 
      + "</td></tr><table>"; layer.on({
            // mouseover: highlightFeature,
            // mouseout: resetHighlight,
            click: zoomToFeature
        }); layer.bindPopup(content);
    }

    function onEachFeature2(feature, layer) {
        var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Address</th><td>" + feature.properties.Address + "<tr><th>Owner</th><td>" + feature.properties.Ownername + "<tr><th>Handle</th><td>" + feature.properties.handle + "</td></tr><table>";
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        layer.bindPopup(content);
    }

    // geojson = L.geoJson(parcels, {
    //     style: style,
    //     onEachFeature: onEachFeature
    // }).addTo(map);



    /* Larger screens get expanded layer control */
    if (document.body.clientWidth <= 767) {
        var isCollapsed = true;
    } else {
        var isCollapsed = false;
    }

    var parcelLayers = [
        { "layer": ownerOccupied, "name": "Owner Occupied" },
        { "layer": condemned, "name": "Condemned Buildings" },
        {"layer": foreclosed, "name":"Foreclosured Homes"},
        { "layer": age, "name": "Housing Stock by Age" },
        {"layer": backtaxes, "name":"Units sold for backtaxes"},
        { "layer": zoning, "name": "Land use by zoing" },
        { "layer": appraisal, "name": "Housing by appraisal value" },
        {"layer": Lravac, "name":"LRA Vacant lots"},
        // {"layer": t_pctowner, "name":"Percent Owner-Occupied Units"},
        // {"layer": t_pctvacant, "name":"Percent Vacant Units"},
        // {"layer": t_l_grocery, "name":"Grocery Leakage"},
        // {"layer": t_l_restaurant, "name":"Restaurant Leakage"},
        // {"layer": t_l_apparel, "name":"Apparel Leakage"}

    ];

    // var neighborhoodlayers = [
    //    {"layer": n_popden, "name":"Population Density"},
    //    {"layer": n_pctyouth, "name":"Percent Youth Under 18"},
    //    {"layer": n_pctseniors, "name":"Percent Seniors Over 65"},
    //    {"layer": n_pctwhite, "name":"Percent White"},
    //    {"layer": n_pctblack, "name":"Percent Black/African American"},
    //    {"layer": n_pctasian, "name":"Percent Asian"},
    //    {"layer": n_pcthispanic, "name":"Percent Hispanic"},
    //    {"layer": n_pctowner, "name":"Percent Owner-Occupied Units"},
    //    {"layer": n_pctvacant, "name":"Percent Vacant Units"},
    //    {"layer": n_l_grocery, "name":"Grocery Leakage"},
    //    {"layer": n_l_restaurant, "name":"Restaurant Leakage"},
    //    {"layer": n_l_apparel, "name":"Apparel Leakage"}

    //    ];

    var baselayers = { "Owner Occupied": ownerOccupied, "Condemned": condemned, "Housing Age by Decade": age, "Appraisal Value": appraisal, "Land Use": zoning, "LRA Vacant Lots" : Lravac, "Foreclosed Homes" : foreclosed, "Homes sold for backtaxes" : backtaxes};
    var overlays = {};

    var layerControl = L.control.layers(baselayers, overlays, {
        collapsed: isCollapsed
    });


    map.addControl(layerControl);
    map.addLayer(ownerOccupied);


    /* Sidebar Legend (changes with base layer change) */


    map.on('baselayerchange', function(a) {
        var legendhtml;
        var layervarname;
        for (var key in meta) {
            if (meta.hasOwnProperty(key)) {
                if (meta[key].indname === a.name) {
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



        sidebar.setContent(legendhtml);

    });



    /* Add Sidebar */

    var sidebar = L.control.sidebar("sidebar", {
        closeButton: true,
        position: "left"
    }).addTo(map);


    /* visible sidebar on start */

    sidebar.show();


    /* Highlight search box text on click */
    $("#searchbox").click(function() {
        $(this).select();
    });

    /* Typeahead search functionality */
    $(document).one("ajaxStop", function() {
        // map.fitBounds(tractbounds.getBounds());
        $("#loading").hide();


        var tractboundsBH = new Bloodhound({
            name: "Tracts",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: tractboundsSearch,
            limit: 10
        });

        var neighborhoodsBH = new Bloodhound({
            name: "Neighborhoods",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: neighborhoodsSearch,
            limit: 10
        });

        var parcelsBH = new Bloodhound({
            name: "Parcels",
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.Address);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: parcelSearch,
            limit: 10
        });

        neighborhoodsBH.initialize();
        tractboundsBH.initialize();
        parcelsBH.initialize();


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
            name: "Parcels",
            displayKey: "Address",
            source: parcelsBH.ttAdapter(),
            templates: {
                header: "<h4 class='typeahead-header'>Neighborhoods</h4>"
            },
        }).on("typeahead:selected", function(obj, datum) {
            if (datum.source === "Parcels") {
                map.fitBounds(datum.bounds);
            }
            if (datum.source === "Neighborhoods") {
                map.fitBounds(datum.bounds);
            }

            if ($(".navbar-collapse").height() > 50) {
                $(".navbar-collapse").collapse("hide");
            }
        }).on("typeahead:opened", function() {
            $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
            $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
        }).on("typeahead:closed", function() {
            $(".navbar-collapse.in").css("max-height", "");
            $(".navbar-collapse.in").css("height", "");
        });
        $(".twitter-typeahead").css("position", "static");
        $(".twitter-typeahead").css("display", "block");
    });







    /* Placeholder hack for IE */
    if (navigator.appName == "Microsoft Internet Explorer") {
        $("input").each(function() {
            if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
                $(this).val($(this).attr("placeholder"));
                $(this).focus(function() {
                    if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
                });
                $(this).blur(function() {
                    if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
                });
            }
        });
    }
