# hdbe: Hierarchical DataBase Ensamble
hdbe is an application layer designed to ensamble independent databases in a hierarchical structure.
The principle is very simple: Each server has a "local" funcionality associated to it. This funcionality is defined in te localtask.js file, and requires the implementation of the onInit, execute and catResponses methods.
On the other side, each server has a set of children servers associated to it through a web service url. The server configuration is defined in the host.json file.
#Example
Supose you want to configure a two layer ensamble of mongodb databases. You want each database to work indenpently of the other, but 
you want to execute some queries in both databases at the same time. So lets call the first server A, and the second server B. In this case, B will
be a child server of A. That means, that all the queries applied to the server A will be proxied to the server B too, but not the opposite.
The host.json configuration for server B will be: 

{
  "port":3001,
  "name":"serverB",
  "children":
  [
  ]
}

That is a webservice listening on the port 3001, and having no children.

The host.json configuration for server A will be: 

{
  "port":3000,
  "name":"serverA",
  "children":
  [
    {
      "name":"serverB",
      "url":"http://localhost:3001/",
      "host":"localhost",
      "port":3001,
      "path":"/",
      "user":null,
      "pass":null
    }
  ]
}

That is a webservice listening at port 3000 and having the webservice B as children. 

In this case, all the POST and GET request arriving to http://localhost:3000/ will be executed by the server A, by using the logic defined in the localtask.execute() method, while a copy of the request is sent to the server B. Once that localtask.execute() and all the children servers returns an answer to the request, the results are concatenated in the localtask.catResponses method and returned one level up in the hierarchy. 

