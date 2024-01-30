const app = require("./app");

// server
app.listen(process.env.PORT || 4000, ()=>{
    console.log(`ecoute sur le port ${process.env.PORT || 4000}`);
});