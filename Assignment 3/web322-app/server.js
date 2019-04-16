var express=require('express');
var data_service=require('./data-service');
var app=express();
var path=require('path');
var multer=require('multer');
var fs=require('fs');
var body_parser=require('body-parser');
var PORT=process.env.PORT||8080;
/******************************************************************* */

/* Starting function  */

function onHttpStart()
{
    console.log("Express http server listening on "+PORT);
}
/******************************************************************* */


/*Adding app.use middleware  */

app.use(body_parser.urlencoded({extended:true}));

/******************************************************************* */


/* employees_add route */


app.post('/employees/add',(req,res)=>{

    data_service.addEmployee(req.body).then(()=>{
        res.redirect('/employees');
    }).catch((data)=>{res.send(data);})
    
    });
    
    
    
    /******************************************************************* */

/* Defining the storage variable for storing an uploaded images */

var storage=multer.diskStorage({
  destination:'./public/images/uploaded',
  filename:function(req,file,cb)
  {
      cb(null,Date.now()+path.extname(file.originalname));
  }

});

/******************************************************************* */

/* Defining the multer upload variable */
var upload=multer({storage:storage});

/******************************************************************* */


/* POST ROUTE for uploading an image file  */

app.post('/images/add',upload.single('imageFile'),(req,res)=>{

  res.redirect('/images');


});
/******************************************************************* */


/* GET /images ROUTE */

app.get('/images',(req,res)=>{

 
    fs.readdir('./public/images/uploaded', function(err, items) {
        
        images='{"images":'+JSON.stringify(items)+'}';  ///Question ?????
        res.send(images);    
       
    });
});

/******************************************************************* */


/*ROUTE for the home page  */

app.use(express.static('public'));

app.get("/",function(req,res)
{

    res.sendFile(path.join(__dirname,"/views/home.html"));
});

/******************************************************************* */


/*ROUTE for the about page  */
app.get("/about",function(req,res)
{

    res.sendFile(path.join(__dirname,"/views/about.html"));
});

/******************************************************************* */


/*ROUTE for the employee page  */

app.get("/employees",function(req,res)
{

        
    

  // optional employees?status query
  if(req.query.status)
  {
    data_service.getEmployeesByStatus(req.query.status).then((data)=>{
       
        res.json(data);
    }).catch((er)=>{res.json({message:er});})
  }

  // optional employees?department=value query
  else if(req.query.department)
  {
      data_service.getEmployeesByDepartment(req.query.department).then((data)=>{
       
        res.json(data);
      }).catch((error)=>{
          res.json({message:error});
      })
  }

  // optional /employees?manager=value

  else if(req.query.manager)
  {
      data_service.getEmployeesByManager(req.query.manager).then((data)=>{
          res.json(data);
      }).catch((error)=>{
          res.json({message:error});
      })
  }
  else 
  {  data_service.getAllEmployees().then((data)=>{
                   res.json(data)}).catch((error)=>
                  {
                      res.json({message:error});
                  })
  }   




})


  //// /employee/value" route 

  app.get('/employee/:num',(req,res)=>{

   data_service.getEmployeeByNum(req.params.num).then((data)=>{

    res.json(data);
   }).catch((error)=>{
       res.json({message:error});
   })


  });



/******************************************************************* */

/*ROUTE for the managers page  */

app.get("/managers",function(req,res)
{
 
     data_service.getManagers().then((data)=>
      {
       res.json(data);
      }).catch((error)=>{
         res.json({message:error});
                        })

    
});

/******************************************************************* */


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

/******************************************************************* */


/* ROUTE for the ADD_EMPLOYEE PAGE */
app.get('/employees/add',(req,res)=>{

res.sendFile(path.join(__dirname,'./views/addEmployee.html'));

});

/******************************************************************* */

/* ROUTE FOR THE ADD_IMAGES PAGE */

app.get('/images/add',(req,res)=>{

res.sendFile(path.join(__dirname,'./views/addImage.html'));

});

/******************************************************************* */



/* Route for the pages which are not found*/
app.use(function(req,res)
{
 res.status(404).send("Page Not Found");
});

/******************************************************************* */


data_service.initialize().then(()=>
{
    app.listen(PORT,onHttpStart);
}).catch((error)=>{

    console.log(error);
})


