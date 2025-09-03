const mongoose= require('mongoose');
console.log(process.env.DB_CONNECT_STRING)
async function main(){
    await mongoose.connect(process.env.DB_CONNECT_STRING)
}

module.exports =main;

