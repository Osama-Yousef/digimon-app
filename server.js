// requirement 
require('dotenv').config();
//app dependencies 
const express = require('express');
const cors = require('cors');
const superagent=require('superagent');
const pg=require ('pg');
const methodOverride = require('method-override');


// main variables 
const app= express();
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 4000 ;

// WE WILL USE THIS TOO

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use (methodOverride('_method'));
app.use(cors());




// route definitions 

app.get('/' , homepagehandler);
app.get('/add',addhandler);
app.get('/myfavourite' , myfavouritehandler)








/*homepagehandler*/
function homepagehandler (req,res){

const url= `https://digimon-api.herokuapp.com/api/digimon`;
superagent.get(url)
.then(data=>{

let dataArray= data.body.map(val=>{

return new News(val);
});

res.render('./index' , {alldata : dataArray})
} )

}


// constructor function

function News(val){
    this.img=val.img;
    this.name=val.name;
    this.level=val.level;
}


// addhandler 

function addhandler (req,res){
    //collect data
    let {img,name,level}=req.query
    //insert
    let sql=`INSERT INTO mytable (img,name,level) VALUES ($1,$2,$3);`;
    let safevalues=[img,name,level];
    //redirecting
    client.query(sql,safevalues)
    .then( () =>{
res.redirect('/myfavourite')

    } )
}

// myfavouritehandler 

function myfavouritehandler(req,res){
    let sql = `SELECT * FROM mytable;`;
    client.query(sql)
    .then(result => {
res.render('./pages/myfavourite' , {myCollection : result.rows})

    })
}




// listen to port 

client.connect()
.then(()=> 
{
    app.listen(PORT , () =>{
console.log(`listening on port ${PORT}`);

    })
    
} )
