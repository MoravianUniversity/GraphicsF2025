// Don't worry about this first line
let p = Promise.resolve('Hello World');

// Chain all of the steps together
p.then(r => 'How are you?').then(r => r + "\nI am fine.").then(r => r + "\nGreat.").then(console.log)
