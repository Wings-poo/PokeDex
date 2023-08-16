let sortstyle = 0;
let idx = 0;
let prev_idx = [0];
let prevsearch = "", prevsort = 0;
let searchmore = true;

async function getAllPoke() {
    const pokedata = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
                            .then((response) => response.json())
                            .catch(error => {console.error(error);});

    return pokedata
}

async function getPoke(pokename) {
    // get pokemon
    let pokeurl = "https://pokeapi.co/api/v2/pokemon/" + pokename;
    const pokemon = await fetch(pokeurl)
                        .then((response) => response.json())
                        .catch(error => {console.error(error);});

    // initialize div
    let strdiv = "<button class=\"btn\" onclick=\"showPoke('"+ pokename + "')\"><div class=\"pokemon\">";
                    
    // insert id and type
    strdiv = strdiv + "<p class=\"pokeidandtype\">";

    // insert id
    let id = pokemon['id'];
    strdiv = strdiv + id;           

    // insert type
    strdiv = strdiv + "<span style=\"float:right;\">";
    let numoftypes = pokemon['types'].length;
    if (numoftypes == 1) {
        let imgtype1 = "./images/poketypes/" + pokemon['types'][0]['type'].name + ".png";
        strdiv = strdiv + "<img src=\"" + imgtype1 + "\" class=\"poketype\">";
    }
    if (numoftypes == 2) {
        let imgtype1 = "./images/poketypes/" + pokemon['types'][0]['type'].name + ".png"
        let imgtype2 = "./images/poketypes/" + pokemon['types'][1]['type'].name + ".png"
        strdiv = strdiv + "<img src=\"" + imgtype1 + "\" class=\"poketype\"> <img src=\"" + imgtype2 + "\" class=\"poketype\">";
    }
    strdiv = strdiv + "</span>"; // end type
    
    strdiv = strdiv + "</p>"; // end id and type
    
    strdiv = strdiv + "<br>";

    // insert picture
    //let imgurl = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + id + ".png"; // does not work for a lot of pokemons
    let imgurl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png"; // also does not work for some pokemons
    strdiv = strdiv + "<img src=\"" + imgurl + "\" class=\"pokepic\">";

    // insert name
    strdiv = strdiv + "<p class=\"pokename\">" + pokename + "</p>";

    strdiv = strdiv + "</div></button>";

    return strdiv;
}

async function get10Pokes(isleft) {
    let pokedata = await getAllPoke();

    if (sortstyle == 1) {
        pokedata['results'].sort(function(a,b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;});
    }

    input = document.getElementById("txtInput");
    searchme = input.value;

    isdigit = /^\d+$/.test(searchme);

    const pokelistid = document.getElementById("listofpokes");
    pokelistid.innerHTML = "";

    if (prevsearch != searchme) {
        idx = 0;
        prev_idx = [0];
        prevsearch = searchme;
    }

    let count = 0;
    for (; idx < pokedata['results'].length; idx++) {
        if (count == 11) {
            idx--;
            searchmore = true;
            break;
        }
        
        if (isdigit == true) {
            if (pokedata['results'][idx].url.slice(34,-1).includes(searchme)) {
                if ((count == 0) && (isleft == false)) {
                    prev_idx.push(idx);
                }
                if (count < 10) {
                    strdiv = await getPoke(pokedata['results'][idx].name);
                    pokelistid.insertAdjacentHTML("beforeend",strdiv); 
                }
                count++;
            }
        } else {
            if (pokedata['results'][idx].name.includes(searchme)) {
                if ((count == 0) && (isleft == false)) {
                    prev_idx.push(idx);
                }
                if (count < 10) {
                    strdiv = await getPoke(pokedata['results'][idx].name);
                    pokelistid.insertAdjacentHTML("beforeend",strdiv); 
                }
                count++;
            }
        }
    }

    if ((idx == pokedata['results'].length) && (count < 11))
        searchmore = false;
}

function sortStyle(style) {
    sortstyle = style;
    if (prevsort != style) {
        prev_idx = [0];
        idx = 0;
        prevsort = style;
    } else {
        idx = prev_idx[prev_idx.length - 1];
    }
    get10Pokes(false);
}

function left() {
    if (prev_idx.length == 1) {
        idx = 0;
    } else {
        prev_idx.pop();
        idx = prev_idx[prev_idx.length - 1];
    }

    get10Pokes(true);
}

function right() {
    if (searchmore == false) {
        idx = prev_idx[prev_idx.length - 1];
    }
    get10Pokes(false);
}

/*I don't understand pokemon stats fully,
but from what I understood strength is the attack is strong against pokemon
resistance is pokemon is strong against that attack
So I didn't include this
const strong = new Map ([
    [type, type],
]);*/

const resist = new Map ([
    ["normal", ["ghost"]],
    ["fighting", ["rock", "bug", "dark"]],
    ["flying", ["fighting", "ground", "bug", "grass"]],
    ["poison", ["fighting", "poison", "grass", "fairy"]],
    ["ground", ["poison", "rock", "electric"]],
    ["rock", ["normal", "flying", "poison", "fire"]],
    ["bug", ["fighting", "ground", "grass"]],
    ["ghost", ["normal", "fighting", "poison", "bug"]],
    ["steel", ["normal", "flying", "poison", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"]],
    ["fire", ["bug", "steel", "fire", "grass", "ice"]],
    ["water", ["steel", "fire", "water", "ice"]],
    ["grass", ["ground", "water", "grass", "electric"]],
    ["electric", ["flying", "steel", "electric"]],
    ["psychic", ["fighting", "psychic"]],
    ["ice", ["ice"]],
    ["dragon", ["fire", "water", "grass", " electric"]],
    ["fairy", ["fighting", "bug", "dragon", "dark"]],
    ["dark", ["ghost", "psychic", "dark"]]
]);

/* I don't understand pokemon stats fully,
but from what I understood weakness is the attack is weak against pokemon
vulnerability is pokemon is weak against that attack
So I didn't include this
const weak = new Map ([
    [type, type],
]);*/

const vulnerable = new Map ([
    ["normal", ["fighting"]],
    ["fighting", ["flying", "pychic", "fairy"]],
    ["flying", ["rock", "electric", "ice"]],
    ["poison", ["ground", "psychic"]],
    ["ground", ["water", "grass", "ice"]],
    ["rock", ["fighting", "ground", "steel", "water", "grass"]],
    ["bug", ["flying", "rock", "fire"]],
    ["ghost", ["ghost", "dark"]],
    ["steel", ["fighting", "ground", "fire"]],
    ["fire", ["ground", "rock", "water"]],
    ["water", ["grass", "electric"]],
    ["grass", ["flying", "poison", "bug", "fire", "ice"]],
    ["electric", ["ground"]],
    ["psychic", ["bug", "ghost", "dark"]],
    ["ice", ["fighting", "rock", "steel", "fire"]],
    ["dragon", ["ice", "dragon", "fairy"]],
    ["fairy", ["poison", "steel"]],
    ["dark", ["fighting", "bug", "fairy"]]
]);

async function showPoke(pokename) {
    let pokeurl = "https://pokeapi.co/api/v2/pokemon/" + pokename;
    const pokemon = await fetch(pokeurl)
                        .then((response) => response.json())
                        .catch(error => {console.error(error);});
    
    let stralert = ""
    stralert = stralert + "ID: " + pokemon['id'] + "\n";
    stralert = stralert + "Name: " + pokename + "\n";
    
    stralert = stralert + "Type(s): ";
    for (let i = 0; i < pokemon['types'].length; i++) {
        stralert = stralert + pokemon['types'][i]['type'].name;
        if (i < pokemon['types'].length - 1)
            stralert = stralert + "/";
    }
    stralert = stralert + "\n";
    
    for (let i = 0; i < pokemon['stats'].length; i++) {
        stralert = stralert + pokemon['stats'][i].stat.name + ": " + pokemon['stats'][i].base_stat + "\n";
    }

    stralert = stralert + "Resistant to (moves): "
    for (let i = 0; i < pokemon['types'].length; i++) {
        let poketype = pokemon['types'][i]['type'].name;
        for (let j = 0; j < resist.get(poketype).length; j++) {
            stralert = stralert + resist.get(poketype)[j];
            if (j < resist.get(poketype).length - 1)
                stralert = stralert + ", ";
        }
        if (i < pokemon['types'].length - 1)
            stralert = stralert + ", ";
    }
    stralert = stralert + "\n";

    stralert = stralert + "Vulnerable to (moves): "
    for (let i = 0; i < pokemon['types'].length; i++) {
        let poketype = pokemon['types'][i]['type'].name;
        for (let j = 0; j < vulnerable.get(poketype).length; j++) {
            stralert = stralert + vulnerable.get(poketype)[j];
            if (j < vulnerable.get(poketype).length - 1)
                stralert = stralert + ", ";
        }
        if (i < pokemon['types'].length - 1)
            stralert = stralert + ", ";
    }

    alert(stralert);
}