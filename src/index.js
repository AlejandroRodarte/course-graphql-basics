// import things we want from the file (should be exported)
// named export (msg) and default export (location, no curly braces)
import myCurrentLocation, { msg, getGreeting } from './myModule';

// default and named exports for the math.js file
import addNumbers, { subtract } from './math';

// using the imported thing
console.log(msg);
console.log(myCurrentLocation);

// using imported functions
console.log(getGreeting('Alejandro'));

const sum = addNumbers(2, 3);
const result = subtract(sum, 1);

console.log(result);