var fs=require('fs'); /* Including file system module*/

var employees=[]; 
var departments=[];

/* Introducing the initialize() function*/
module.exports.initialize=function()
{
  return new Promise(function (resolve,reject){ /*initializing promise*/

  try{

  /* READING THE EMPLOYEES.JSON File*/
    fs.readFile("./data/employees.json",'utf8',(err,data)=>{   
      if(err)throw err;
       employees=JSON.parse(data);
        });   

  /* READING THE DEPARTMENTS.JSON File*/

    fs.readFile("./data/departments.json",'utf8',(err,data)=>
    {
    if(err) throw err;
    departments=JSON.parse(data);
    });

    resolve();
}catch(ex)
   {
     reject("Unable to read file"); return;
   }

  });
}


/* Declaration of getAllEmployees function */

module.exports.getAllEmployees=function()
{
  
  return new Promise(function (resolve,reject){
  if(employees.length==0)
  {
    reject("no results returned"); return;
  }
  resolve(employees);
});

}

/* Declaration of getManagers function */

module.exports.getManagers=function()
{
  return new Promise((resolve,reject)=>{
     var managers=[];
     for(var i=0;i<employees.length;i++)
     {
         if(employees[i].isManager==true)
          {
           managers[i]=employees[i];
    
          }}
  
   if(employees.length==0)
  {
    reject('no results returned');return;
  }

  resolve(managers);
});
}

/* Declaration of getDepartments function */
 module.exports.getDepartments=function()
 {
   return new Promise((resolve,reject)=>{
   if(departments.length==0)
   {
     reject("no results returned"); return;
   }
   resolve(departments);
  });
 }


