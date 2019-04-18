var express=require('express');
var data_service=require('./data-service');
var app=express();
var path=require('path');
var multer=require('multer');
var fs=require('fs');
var body_parser=require('body-parser');
var exphbs=require("express-handlebars");
var PORT=process.env.PORT||8080;
/******************************************************************* */

/* Starting function  */


function onHttpStart()
{
    console.log("Express http server listening on "+PORT);
}
/******************************************************************* */

/* Adding ActiveRoute property to app.locals*/

app.use(function(req,res,next){     
     let route = req.baseUrl + req.path;    
     app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");    
      next(); 
}); 



/******************************************************************* */

/*Setting up express handlebars*/

app.engine(".hbs",exphbs(

    {extname:".hbs",
     defaultLayout:"main",
     helpers:
     {
        navLink: function(url, options){   
       return '<li' +((url == app.locals.activeRoute) ? ' class="active" ' : '')+'><a href="' + url + '">' + options.fn(this) + '</a></li>'; 
                                       } ,
      equal: function (lvalue, rvalue, options) 
      {     
          if (arguments.length < 3) 
            throw new Error("Handlebars Helper equal needs 2 parameters");    
             if (lvalue != rvalue) { 
                                        return options.inverse(this); 
                                    } else { 
                                        return options.fn(this); 
                                    } 
      } 
                                

     }                   

    }));
app.set("view engine",".hbs");

/******************************************************************* */

/*Adding app.use middleware for body parser */

app.use(body_parser.urlencoded({extended:true}));

/******************************************************************* */

/******************************************************************* */
/******************************************************************* */
/************************ ALL POST ROUTES ****************************/
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

/**************************************
 * Adding route post employee/update 
 * ************************************/
app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch((error) => {
        res.render('employees', { message: "Employee was not updated successfuly" });
    })
}); 

/******************************************************************* */
/******************************************************************* */
/************************POST ROUTES fineshed*************************/
/******************************************************************* */


/******************************************************************* */
/******************************************************************* */
/************************ ALL GET ROUTES ****************************/
/******************************************************************* */

/* GET /images ROUTE */

app.get('/images',(req,res)=>{

 
    fs.readdir('./public/images/uploaded', function(err, items) {
        
       /* images='{"images":'+JSON.stringify(items)+'}';  ///Question ?????
        res.send(images);   */
        
        res.render('images',{data:items});
       
    });
});

/******************************************************************* */


/*ROUTE for the home page  */

app.use(express.static('public'));

app.get("/",function(req,res)
{

    res.render('home');
});

/******************************************************************* */


/*ROUTE for the about page  */
app.get("/about",function(req,res)
{

    res.render('about');
});

/******************************************************************* */


/*ROUTE for the employee page  */

app.get("/employees",function(req,res)
{

        
    

  // optional employees?status query
  if(req.query.status)
  {
    data_service.getEmployeesByStatus(req.query.status).then((data)=>{
       
        res.render('employees',{data:data});
    }).catch((er)=>{res.render('employees',{message:"no results"});})
  }

  // optional employees?department=value query
  else if(req.query.department)
  {
      data_service.getEmployeesByDepartment(req.query.department).then((data)=>{
       
        res.render('employees',{data:data});
      }).catch((error)=>{
          res.render('employees',{message:"no results"});
      })
  }

  // optional /employees?manager=value

  else if(req.query.manager)
  {
      data_service.getEmployeesByManager(req.query.manager).then((data)=>{
          res.render('employees',{data:data});
      }).catch((error)=>{
          res.render('employees',{message:"no results"});
      })
  }
  else 
  {  data_service.getAllEmployees().then((data)=>{
                   res.render('employees',{data:data})}).catch((error)=>
                  {
                      res.render('employees',{message:"no results"});
                  })
  }   




})


  //// /employee/value" route 

  app.get('/employee/:num',(req,res)=>{

   data_service.getEmployeeByNum(req.params.num).then((data)=>{

    res.render('employee',{data:data});
   }).catch((error)=>{
       res.render('employee',{message:"no results"});
   })


  });



/******************************************************************* */

/* ****************************************
*******************************************
Managers route is deleted from the project
******************************************* 
*******************************************/


/******************************************************************* */


/*ROUTE for the departments page  */

app.get("/departments",function(req,res)
{

    data_service.getDepartments().then((data)=>
    {
     res.render('departments',{data:data});
    }).catch((error)=>{
    res.render({message:"No data is found"});
                     })
});

/******************************************************************* */


/* ROUTE for the ADD_EMPLOYEE PAGE */
app.get('/employees/add',(req,res)=>{

res.render('addEmployee');

});

/******************************************************************* */

/* ROUTE FOR THE ADD_IMAGES PAGE */

app.get('/images/add',(req,res)=>{

res.render('addImage');
});

/******************************************************************* */

/******************************************************************* */
/******************************************************************* */
/************************ ALL GET ROUTES Finished ********************/
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


