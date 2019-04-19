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
       
        if(data.length>0)
        {res.render('employees',{data:data});}
        
        
    }).catch((er)=>{res.render('employees',{message:"no results"});})
  }

  // optional employees?department=value query
  else if(req.query.department)
  {
      data_service.getEmployeesByDepartment(req.query.department).then((data)=>{
       
        res.render('employees',{data:data});
      }).catch((error)=>{
          res.render('employees',{message:'no results'});
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
  {
     
      data_service.getAllEmployees().then((data) => {
          if(data.length>0)
          {
          res.render('employees', { data: data })
          }
          else
          {
            res.render('employees', { message: "no results" });
          }
      }).catch((error) => {
          console.log(error);
          res.render('employees', { message: "no results" });
      });
  }   




})


  
/******************************************************************* */
/******************************************************************* */
  // employee/:empNum ROUTE

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data_service.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data) {
        
        viewData.employee = data;
        //store employee data in the "viewData" object as "employee"
 } else {
 viewData.employee = null; // set employee to null if none were returned
 }
 }).catch(() => {
 viewData.employee = null; // set employee to null if there was an error
 }).then(data_service.getDepartments)
 .then((data) => {
 viewData.departments = data; // store department data in the "viewData" object as "departments"
 // loop through viewData.departments and once we have found the departmentId that matches
 // the employee's "department" value, add a "selected" property to the matching
 // viewData.departments object
 for (let i = 0; i < viewData.departments.length; i++) {
 if (viewData.departments[i].departmentId == viewData.employee.department) {
 viewData.departments[i].selected = true;
 }
 }
 }).catch(() => {
 viewData.departments = []; // set departments to empty if there was an error
 }).then(() => {
 if (viewData.employee == null) { // if no employee - return an error
 res.status(404).send("Employee Not Found" );

 } else {
 res.render("employee", { viewData: viewData }); // render the "employee" view
 }
 });
});


/******************************************************************* */
// employee delete route
app.get('/employees/delete/:empNum',(req,res)=>{
   

    data_service.deleteEmployeeByNum(req.params.empNum).then(()=>{
         res.redirect('/employees');
     }).catch((errror)=>{
         res.status(500).send("Unable to Remove Employee / Employee not found)")
     });
 })
 
/* ****************************************
*******************************************
Managers route is deleted from the project
******************************************* 
*******************************************/


/******************************************************************* */


/*ROUTE for the departments page  */

app.get('/departments',function(req,res)
{

    
   data_service.getDepartments().then((data)=>
    {
        if(data.length>0)
        {
         res.render('departments',{data:data});
        }
        else
        {
            res.render('departments',{message:"no results"});
        }
        
    }).catch((error)=>{
    res.render('departments',{message:"no results"});
                     });
});

/******************************************************************* */


/* ROUTE for the ADD_EMPLOYEE PAGE */
app.get('/employees/add',(req,res)=>{

    data_service.getDepartments().then((data)=>{
        res.render('addEmployee',{departments:data});
    }).catch((error)=>{
        res.render("addEmployee", {departments: []});
    });


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




/******************************************************************* */


/**********************************************************************************************************************************/
/**********************************************************************************************************************************/
// Creating new routes for the departments page

// departments/add GET route

app.get('/departments/add',(req,res)=>{

    res.render('addDepartment');
    
    });

// departments/add POST route


app.post('/departments/add',(req,res)=>{

    data_service.addDepartment(req.body).then(()=>{
        res.redirect('/departments');
    }).catch((data)=>{res.send(data);})
    
    });

// department update ROUTE


app.post("/department/update", (req, res) => {
    data_service.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch((error) => {
        res.render('departments', { message: "Department was not updated successfuly" });
    })
}); 

// department/:departmentId ROUTE

app.get('/department/:departmentId',(req,res)=>{

    data_service.getDepartmentById(req.params.departmentId).then((data)=>{
 
     res.render('department',{data:data});
    }).catch((error)=>{
        res.status(404).send("Department Not Found");
    })
 
 
   });

// /departments/delete/:departmentId ROUTE

app.get('/department/delete/:departmentId',(req,res)=>{
   

   data_service.deleteDepartmentById(req.params.departmentId).then(()=>{
        res.redirect('/departments');
    }).catch((errror)=>{
        res.status(500).send("Unable to Remove Department / Department not found)")
    });
})


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
