using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ImageHub.Models;

namespace ImageHub.Controllers
{
    [Authorize]
    [Route("api/metadata")]
    public class MetadataController : ControllerBase
    {
        private readonly ihubDBContext _context;

        public MetadataController(ihubDBContext context)
        {
            _context = context;
        }

        /*
        GET
        API Endpoint: api/metadata/
        Description: Get list of metadata
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - metadata retrieve was successful server should return metadata data
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpGet("")]
        public Object GetMetadata()
        {
            try
            {
                return JsonConvert.SerializeObject(_context.Metadata);
            }
            catch (Exception e)
            {
                return e;
            }
        }

        /*
        PUT
        API Endpoint: api/metadata/:metaname
        Description: Modifies metadata
        Request Requirements:
        1. User JWT in header field
        2. Admin

        Server response and status code:
        200 - Project modification was successful 
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to modify metadata
        */
        [Authorize(Policy = "Admins")]
        [HttpPut("{metaname}")]
        public Object PutMetadata(string metaname, [FromBody] JObject payload)
        {
            try
            {
                Metadata metadata = (Metadata)_context.Metadata.Where(m => m.MetaName == metaname).First();
                if (payload["Active"].Type != JTokenType.Null) { metadata.Active = (bool)payload["Active"]; };
                if (payload["Mandatory"].Type != JTokenType.Null) { metadata.Mandatory = (bool)payload["Mandatory"]; };
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