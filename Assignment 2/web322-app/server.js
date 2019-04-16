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
