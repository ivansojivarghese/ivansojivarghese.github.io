

var apB_A = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], // latin alphabets
    uId_e = [], // entered (returned) unique ids
    tabID = "";


function u_Id() { // create unique identifiers for characters (operators)
    // 2 parts: 3-digit numeral - alphabet character
    // '123' + 'A' = '123A'
    do {
        var d = r_Ig(100, 1000),  // return a random integer from 100 - 999
            a = apB_A[r_Ig(0, apB_A.length - 1)], // return a random alphabet (A-Z)
            f = d + a; // 'd + a' returns the 'id'
    }
    while (uId_e.indexOf(f) !== -1 && !getCookie(f)); // create another 'id' if uniqueness is not met - if similar id is found in global var./cookie scope

    uId_e.push(f); // add to global var. for reference

    tabID = f;
}

function r_Ig(min, max) { // return random integer between 2 values (only min inclusive)
    return Math.floor(Math.random() * (max - min)) + min;
}

u_Id();  // GET UNIQUE TAB ID

setCookie(tabID, "true", op.c.t); // set a reference cookie