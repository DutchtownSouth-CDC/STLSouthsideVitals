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
        numclasses: 10,
        breaks: ['d==0','d>2000', 'd>1990', 'd>1980', 'd>1970', 'd>1960', 'd>1950', 'd>1940', 'd>1930'],
        colors: [grey, darkblue, lightblue, lightgreen, lightyellow, olivegreen, magenta, deeporange, red, orange],
        labtext: ['no year','2000-2009', '1990-1999', '1980-1989', '1970-1979', '1960-1969', '1950-1959', '1940-1949', '1930-1939', '1939 or earlier']
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
