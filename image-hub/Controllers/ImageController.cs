using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using ImageHub.Models;
using ImageHub.Repository;

namespace ImageServer.Controllers
{
    [Authorize]
    [Route("api/image")]
    public class ImageController : Controller
    {
        private readonly ihubDBContext _context;
        private readonly IImageRepository _repo;

        
        public ImageController(ihubDBContext context, IImageRepository repo)
        {
            _context = context;
            _repo = repo;
        }

        /* POST
        API Endpoint: api/image/
        Description: Uploads image to the server
        Request Requirements:
        1. User JWT in header field
        2. Image file attachment
        3. Metadata(optional)

        Server response and status code:
        201 - image upload was successful server should return a link to the image and its metadata
        400 - malformed request due to unsupported file extension or etc
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        409 - image already exists on the server
        */
        public IActionResult UploadImage([FromForm]IFormFile image)
        {
            // check if image is passed in and also if it's valid image type
            if(image == null)
            {
                return BadRequest("no image passed in");
            } else if (!_repo.IsImageFileType(image))
            {
                return BadRequest("invalid file extension");
            }

            // check if image exists
            Image img = GetImageModel(image);
            if (ImageExists(img.IId))
            {
                Image dbImgRecord = (Image)_context.Image.Where(i => i.IId == img.IId).First();
                if (dbImgRecord.Trashed)
                {
                    dbImgRecord.Trashed = false;
                    _context.Update(dbImgRecord);
                    _context.SaveChanges();
                    return Created(dbImgRecord.IId, img);
                }
                else
                {
                    return Conflict("image already exists");
                }
            }

            // add image meta data into database
            try
            {
                _context.Add(img);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                Debug.Write("SQL exception" + e.Message);
                return BadRequest("malform request");
            }

            // store image onto disk
            string uri = _repo.StoreImageToDisk(image);
            img.IId = uri; // change database iId type
            return Created(uri, img);
        }

        private Image GetImageModel(IFormFile image)
        {
            string fn = Path.GetFileNameWithoutExtension(image.FileName);
            Image img = new Image()
            {
                IId = ImageWriter.GetImageHash(image),
                UId = HttpContext.User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier"),
                ImageName = fn,
                Size = (Int32)image.Length,
                UploadedDate = DateTime.Now,
                Type = _repo.GetFileExtension(image),
                Trashed = false,
                Submitted = false,
                UploadedBy = HttpContext.User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier")
            };
            return img;
        }

        /* GET
        API Endpoint: api/image/:image_id
        Description: Retrieves image from the server as well as its metadata
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - image retrive successful server should return an image
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to view image
        404 - image does not exist
        */
        [HttpGet("{filename}")]
        [AllowAnonymous]
        public IActionResult GetImage(string filename)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "ImageResources", filename);
            Debug.Write(path);
            bool exists = System.IO.File.Exists(path);
            if (exists)
            {
                var image = System.IO.File.OpenRead(path);
                return File(image, "image/jpeg");
            }
            else{
                return NotFound();
            }
        }

        /*
        PUT
        API Endpoint: api/image/{imageid}
        Description: Modify metadata or the image itself.
        Request Requirements:
        1. User JWT in header field
        2. Image file attachment
        3. Metadata(optional)

        Server response and status code:
        200 - image put request was successful server should return the modified image_id
        400 - malformed request
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        404 - image does not exist
        */
        [HttpPut("{imageid}")]
        [AllowAnonymous]
        public Object PutImage(string imageid, [FromBody] JObject payload)
        {
            
            try
            { 
                Image image = (Image)_context.Image.Where(i => i.IId == imageid).First();
                if (payload["UId"].Type != JTokenType.Null) { image.UId = (string)payload["UId"]; };
                if (payload["ImageName"].Type != JTokenType.Null) { image.ImageName = (string)payload["ImageName"]; };
                if (payload["Trashed"].Type != JTokenType.Null) { image.Trashed = (bool)payload["Trashed"]; };
                if (payload["Submitted"].Type != JTokenType.Null)
                {
                    image.Submitted = (bool)payload["Submitted"];
                    if (!image.Submitted)
                    {
                        var projectlinks = _context.ProjectLink.Where(pl => pl.IId == imageid);
                        var loglinks = _context.LogLink.Where(ll => ll.IId == imageid);
                        foreach(var pl in projectlinks)
                        {
                            _context.ProjectLink.Remove(pl);
                        }

                        foreach (var ll in loglinks)
                        {
                            _context.LogLink.Remove(ll);
                        }
                    }
                };
                
                _context.SaveChanges();
                return imageid;
            }
            catch (Exception e)
            {
                Console.WriteLine("Reached 169");
                Console.WriteLine(e.Message);
                return e;
            }
        }
       

        /* DELETE
        API Endpoint: api/image/:image_id
        Description: Deletes image from the server
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - image delete was successful
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        403 - user not authorized to delete image
        404 - image does not exist
        */
        [Authorize (Policy = "Admins")]
        [HttpDelete(("{uri}"))]
        public IActionResult DeleteImage(string uri)
        {
            Image image =  _context.Image.Find(uri);
            if (image == null)
            {
                return NotFound();
            }
            _context.Image.Remove(image);
            var path = Path.Combine(Directory.GetCurrentDirectory(), "ImageResources", uri);
            _context.SaveChanges();
            System.IO.File.Delete(path);
            return Accepted();
        }
        
        private bool ImageExists(string id)
        {
            return _context.Image.Any(e => e.IId.Equals(id));
        }
    }
}
