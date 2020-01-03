using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ImageHub.Models;

namespace ImageHub.Controllers
{
    [Authorize]
    [Route("api/log/view")]
    public class LogViewController : ControllerBase
    {
        private readonly ihubDBContext _context;

        public LogViewController(ihubDBContext context)
        {
            _context = context;
        }

        /*
        GET
        API Endpoint: api/log/
        Description: Get list of logs
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - Log retrieve was successful server should return log data
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpGet("{logid}")]
        public Object GetLogLinks(string logid)
        {
            try
            {
                return JsonConvert.SerializeObject(_context.LogLink.Where(l => l.LId == logid));
            }
            catch(Exception e)
            {
                return e;
            }
        }
        
    }
}