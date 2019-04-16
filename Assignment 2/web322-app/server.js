/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Damirkhon Yodgorov_ Student ID: 108364175 Date: October 1, 2018
*
* Online (Heroku) Link: https://fierce-harbor-57006.herokuapp.com
*
********************************************************************************/ 

var express=require('express');
var data_service=require('./data-service');
var app=express();
var path=require('path');
var PORT=process.env.PORT||8080;

/* Starting function  */

function onHttpStart()
{
    console.log("Express http server listening on "+PORT);
}

/*ROUTE for the home page  */

app.use(express.static('public'));

app.get("/",function(req,res)
{

    res.sendFile(path.join(__dirname,"/views/home.html"));
});

/*ROUTE for the about page  */
app.get("/about",function(req,res)
{

    res.sendFile(path.join(__dirname,"/views/about.html"));
});


/*ROUTE for the employee page  */

app.get("/employees",function(req,res)
{

  data_service.getAllEmployees().then((data)=>{
                     res.json(data)}).catch((error)=>
                    {
                        res.json(error);
                    })

});

/*ROUTE for the managers page  */

app.get("/managers",function(req,res)
{
 
     data_service.getManagers().then((data)=>
      {
       res.json(data);
      }).catch((error)=>{
         res.json(data);
                        })

    
});

/*ROUTE for the departments page  */

app.get("/departments",function(req,res)
{

    data_service.getDepartments().then((data)=>
    {
     res.json(data);
    }).catch((error)=>{
    res.json(error);
                     })
});


/* Route for the pages which are not found*/
app.use(function(req,res)
{
 res.status(404).send("Page Not Found");
});


data_service.initialize().then(()=>
{
    app.listen(PORT,onHttpStart);
}).catch((error)=>{

    console.log(error);
})