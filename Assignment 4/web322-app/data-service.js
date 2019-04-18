var fs=require('fs'); /* Including file system module*/

var employees=[]; 
var departments=[];

/* Introducing the initialize() function*/
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) { /*initializing promise*/

    /* READING THE EMPLOYEES.JSON File*/
    fs.readFile("./data/employees.json", 'utf8', (err, data) => {
      if (err) {
        reject("Unable to read file"); return;
      }

      employees = JSON.parse(data);

      fs.readFile("./data/departments.json", 'utf8', (err, data) => {
        if (err) {
          reject("Unable to read file"); return;
        }

        departments = JSON.parse(data);

        resolve();
      });
    });
  });
}


/******************************************************************* */


/* Declaration of getAllEmployees function */

module.exports.getAllEmployees=function()
{
  
  return new Promise(function (resolve,reject){
  if(employees.length==0)
  {
    reject("no results returned");
  }
  resolve(employees);
});

}
/******************************************************************* */


/* Declaration of getManagers function */

module.exports.getManagers=function()
{
  return new Promise((resolve,reject)=>{
     var managers=[];
     var j=0;
     for(var i=0;i<employees.length;i++)
     {
         if((employees[i].isManager))
          {
           managers[j++]=employees[i];
    
          }}
  
   if(employees.length==0)
  {
    reject('no results returned');return;
  }
  else{
  resolve(managers);}
});
}

/******************************************************************* */

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

/******************************************************************* */

/* Add_Employees Module */

module.exports.addEmployee=function(employeeData)
{
  return new Promise(function(resolve,reject){
    
     
    try{

     employeeData.isManager=(employeeData.isManager)?true:false;
     employeeData.employeeNum=employees.length+1;
     employees[employeeData.employeeNum-1]=employeeData;
     resolve();
    
  }catch(ex){
    reject();
  }



});

}

/******************************************************************* */

// getEmployeesByStatus(status) function //

module.exports.getEmployeesByStatus=function(status)
{

  return new Promise(function(resolve,reject){
  
  
  var employees_status=[];
  var j=0;

  
  
  
  
      for (var i=0;i<employees.length;i++)
       {
             if (employees[i].status==status)
              {
                employees_status[j++]=employees[i];
              }
        }

 
    if(employees_status.length==0)
    {
      reject("No results found!");
    }
    else
    {
      resolve(employees_status);
    }

  
});

}




/******************************************************************* */

// module getEmployeesByDepartment(department)

module.exports.getEmployeesByDepartment=function(department)
{
  return new Promise(function(resolve,reject){
    var department_employees=[];
  
    var j=0;

    
        for (var i=0;i<employees.length;i++)
         {
               if (employees[i].department==department)
                {
                  department_employees[j++]=employees[i];
                }
                
          }
         if(department_employees.length==0)
         {
           reject("No results found!");
         }
         else{   
          resolve(department_employees);}
  
    
  });
}

/******************************************************************* */


// getEmployeesByManager(manager) Function 
module.exports.getEmployeesByManager=function(manager){

  return new Promise((resolve,reject)=>{
  var manager_employees=[];
   var j=0;
  for(var i=0;i<employees.length;i++)
  {
    if(employees[i].employeeManagerNum==manager)
    {
      manager_employees[j++]=employees[i];
    }
  }
 
  if(manager_employees==0)
  {
    reject("No data is found inside an array");
  }
  else
  {
    resolve(manager_employees);
  }

});



}


/******************************************************************* */


// getEmployeeByNum function 

module.exports.getEmployeeByNum=function(num)
{
  return new Promise((resolve,reject)=>{
       var employer=[];

        for(var i=0;i<employees.length;i++)
        {
            if(employees[i].employeeNum==num)
            {
              employer=employees[i];
            }
        }

        if(employer.length==0)
        {
        reject("No Data is Found");
        }   
        else
        {
          resolve(employer);
        } 
        
});

}

/***************************/
// updateEmployee function 
/**************************/

module.exports.updateEmployee=function(newData)
{
  
  
  return new Promise((resolve,reject)=>{
    var found=0;

   

    newData.isManager = (newData.isManager) ? true : false;

    
   
    for(var i=0;i<employees.length;i++)
   {
    if(employees[i].employeeNum==newData.employeeNum)
    {
      
      employees[i]=newData;
      found++;
    }
   }
   if(found==1)

   {
     resolve();
   }
   else
   {
     reject("Employee was not updated successfully");
   }

});

}