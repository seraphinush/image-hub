# image-hub
UBC CPSC 319 project by team NLGPSAG for Associative Engineering (AE)

## Runtime environment
* .Net Core 2.1 (Back-end)
* npm with React 16.8.3 or above (Front-end)
* Azure Active Directory (Authentication)
* Microsoft SQL Server (Database)

## How to run Image Hub
1. Clone repository
2. Install npm packages by running `npm install` in directory `\image-hub\ClientApp`
3. Set Azure Active Directory configurations in directory `\image-hub\ClientApp\src\adalConfig.js`
4. Set Azure Active Directory configurations and Microsoft SQL Server connection configurations in directory `image-hub\appsettings.json`
5. Run project on Visual Studio (recommended) or JetBrains Rider

## Setting up Azure Active Directory
The porject is hosted on azure and uses AAD for authentication
1. Create an azure web app. [How to create an azure app](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)
2. Change the settings in `adalConfig.js` found in `\image-hub\ClientApp\src\adalConfig.js`. Check [react-adal](https://github.com/salvoravida/react-adal/blob/master/README.md) docs for more info
3. Change the settings in `GraphApiController.cs` found in `\image-hub\Controllers` to match your app information

## Admin Authorization Policies
1. Create an Admin group in AAD. [How to create a group](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal)
2. Get the group ID
3. Go to `image-hub\Startup.cs` and locate the comment ``// Authorization``
4. Replace the group ID inside the `policyBuilder` with the one you created

For more information read [here](https://blogs.msdn.microsoft.com/gianlucb/2017/10/27/azure-ad-and-group-based-authorization/)

## Setting up database
1. Entity-relationship diagram
<p align="center">
<a href="../master/doc/er_diagram.png">
<img src="../master/doc/er_diagram.png" height="300" />
</a>
</p>

2. [Relationship schema](../master/doc/relationship_schema.pdf)
3. SQL file to cerate and batch the database server:

    - [1st sql file](../master/doc/database_1.sql) is "create the database" which is neededt o query on the master database
    - [2nd sql file](../master/doc/database_2.sql) is "fill the created database" which is needed to query on the created database

4. Set up [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download?view=sql-server-2017) for the database

## Live Website
~~https://aeimagehub.azurewebsites.net~~
