using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ImageHub.Models;

namespace ImageHub.Controllers
{
    [Authorize]
    [Route("api/project")]
    public class ProjectController : ControllerBase
    {
        private readonly ihubDBContext _context;

        public ProjectController(ihubDBContext context)
        {
            _context = context;
        }

        /*
        GET
        API Endpoint: api/project/
        Description: Retrieves projects
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - Project retrieve was successful server should return project list
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpGet("")]
        public Object GetProjects()
        {
            try
            {
                return JsonConvert.SerializeObject(_context.Project);
            }
            catch (Exception e)
            {
                return e;
            }
        }

        /*
        GET
        API Endpoint: api/project/:project_id
        Description: Retrieves project
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - Project retrieve was successful server should return project data
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to view project
        */
        [HttpGet("{projectname}")]
        public Object GetProject(string projectname)
        {
            try
            {
                var project = _context.Project
                    .Where(p => p.ProjectName == projectname)
                    .Include(p => p.ProjectLink)
                    .First();
                return JsonConvert.SerializeObject(project);
            }
            catch (Exception e) 
            {
                return e;
            }
        }

        /*
        POST
        API Endpoint: api/project
        Description: Creates project(Admin only)
        Request Requirements:
        1. User JWT in header field
        2. Project credentials

        Server response and status code:
        200 - Project creation was successful
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to create project
        */
        [Authorize(Policy = "Admins")]
        [HttpPost("")]
        public Object PostProject([FromBody] JObject payload)
        {
            try
            {
                Project project = new Project()
                {
                    ProjectName = (string)payload["ProjectName"],
                    CreatedDate = (DateTime)payload["CreatedDate"],
                    Description = (string)payload["Description"],
                    Active = (bool)payload["Active"]
                };

                _context.Project.Add(project);
                _context.SaveChanges();
                return "success";
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /*
        PUT
        API Endpoint: api/project/:project_id
        Description: Modifies user profile
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - Project modification was successful 
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to modify project
        */
        [Authorize(Policy = "Admins")]
        [HttpPut("{projectname}")]
        public Object PutProject(string projectname, [FromBody] JObject payload)
        {
            try
            {
                Project project = (Project)_context.Project.Where(p => p.ProjectName == projectname).First();
                if (payload["ProjectName"].Type != JTokenType.Null) { project.ProjectName = (string)payload["ProjectName"]; };
                if (payload["CreatedDate"].Type != JTokenType.Null) { project.CreatedDate = (DateTime)payload["CreatedDate"]; };
                if (payload["Description"].Type != JTokenType.Null) { project.Description = (string)payload["Description"]; };
                if (payload["Active"].Type != JTokenType.Null) { project.Active = (bool)payload["Active"]; };
                _context.SaveChanges();
                return "success";
            }
            catch (Exception e)
            {
                return e;
            }
        }
    }
}