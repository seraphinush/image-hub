using System;
using System.Collections.Generic;
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
    [Route("api/tag")]
    public class TagController : ControllerBase
    {
        private readonly ihubDBContext _context;

        public TagController(ihubDBContext context)
        {
            _context = context;
        }

        /*
        GET
        API Endpoint: api/tag/
        Description: Get list of tags
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - Tag retrieve was successful server should return tag list
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpGet("")]
        public Object GetTags()
        {
            return JsonConvert.SerializeObject(_context.Tag);
        }

        /*
        POST
        API Endpoint: api/tag
        Description: Creates tag(Admin only)
        Request Requirements:
        1. User JWT in header field
        2. Admin credentials

        Server response and status code:
        201 - Tag creation was successful
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to create tag
        */
        [HttpPost("")]
        public void PostTag([FromBody] JObject payload)
        {
            Tag tag = new Tag()
            {
                TagName = (string)payload["TagName"],
                Description = (string)payload["Description"],
                Active = (bool)payload["Active"],
            };

            _context.Tag.Add(tag);
            _context.SaveChanges();
        }

        /*
        PUT
        API Endpoint: api/tag/:tag_name
        Description: Modifies user profile
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - Project modification was successful 
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to modify tag
        */
        [HttpPut("{tagname}")]
        public void PutTag(string tagname, [FromBody] JObject payload)
        {
            Tag tag = (Tag)_context.Tag.Where(t => t.TagName == tagname).First();
            tag.TagName = (string)payload["TagName"];
            tag.Description = (string)payload["Description"];
            tag.Active = (bool)payload["Active"];
            _context.SaveChanges();
        }

        /*
        DELETE
        API Endpoint: api/tag/:tagname
        Description: Deletes tag from the server
        Request Requirements:
        1. User JWT in header field
        2. Admin

        Server response and status code:
        200 - tag delete was successful
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to delete image
        404 - image does not exist
        */
        [HttpDelete("{tagname}")]
        public Object DeleteTag(string tagname)
        {
            try
            {
                Tag tag = (Tag)_context.Tag.Where(t => t.TagName == tagname).First();
                _context.Tag.Remove(tag);
                _context.SaveChanges();
                return ("delete tag success");
            }
            catch (Exception e)
            {
                return e;
            }
        }

        /*
        POST
        API Endpoint: api/tag/taglink
        Description: Creates taglink
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        201 - Taglink creation was successful
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpPost("taglink")]
        public Object PostTagLink([FromBody] JObject payload)
        {
            try
            {
                TagLink taglink = new TagLink()
                {
                    TagName = (string)payload["TagName"],
                    IId = (string)payload["IId"]
                };
                _context.TagLink.Add(taglink);
                _context.SaveChanges();
                return "success";
            }
            catch (Exception e)
            {
                return e;
            }
        }

        /*
        POST
        API Endpoint: api/tag/taglink
        Description: Creates taglink
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        201 - Taglink creation was successful
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpPost("taglinks")]
        public Object PostTagLinks([FromBody] JObject payload)
        {
            try
            {
                foreach (string tn in payload["TagNames"])
                {
                    TagLink taglink = new TagLink()
                    {
                        TagName = tn,
                        IId = (string)payload["IId"]
                    };
                    _context.TagLink.Add(taglink);
                }
                _context.SaveChanges();
                return "success";
            }
            catch (Exception e)
            {
                return e;
            }
        }

        /*
        DELETE
        API Endpoint: api/tag/taglink/:imageid
        Description: Deletes taglink of imageid from the server
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - taglink delete was successful
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpDelete("taglink/{imageid}")]
        public Object DeleteTagLink(string imageid)
        {
            try
            {
                var taglinks = _context.TagLink.Where(tl => tl.IId == imageid);
                foreach (var tl in taglinks)
                {
                    _context.TagLink.Remove(tl);
                }
                _context.SaveChanges();
                return ("delete taglinks success");
            }
            catch (Exception e)
            {
                return e;
            }
        }
    }

}