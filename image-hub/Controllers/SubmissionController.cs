using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Graph;
using Newtonsoft.Json.Linq;
using ImageHub.Models;
using ImageHub.Repository;
using Image = ImageHub.Models.Image;

namespace ImageServer.Controllers
{
    [Authorize]
    [Route("api/submit")]
    public class SubmissionController : Controller
    {
        private readonly ihubDBContext _context;
 
    
        public SubmissionController(ihubDBContext context, IImageRepository repo)
        {
            _context = context;
        }
   
        /*
        Post
        API Endpoint: api/submit
        Description: Submits images to a project
        */
        [HttpPost("")]
        public Object SubmitImage([FromBody] Submission submission)
        {
            Log dbLog = GenerateLog(submission.Images.Count.ToString() + " images submitted");
            List<Image> images = new List<Image>();

            try
            {
                _context.Add(dbLog);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e);
                return BadRequest("malform request log");
            }

            foreach (string imageid in submission.Images)
            {
                try
                {
                    Image image = (Image) _context.Image.Where(i => i.IId == imageid).First();
                    image.Submitted = true;
                    ProjectLink dbProjectLink = GenerateProjectLink(image, submission.Project);
                    LogLink dbLogLink = GenerateLogLink(image, dbLog);

                    _context.Add(dbLogLink);
                    _context.Add(dbProjectLink);
                    _context.SaveChanges();
                }
                catch (Exception e)
                {
                    Console.Write(e);
                    return BadRequest("malform request project");
                }
            }

            try
            {
               var username = HttpContext.User.FindFirstValue("name");
               var logLink = "https://aeimagehub.azurewebsites.net/logview?src=%22" + dbLog.LId +"%22";
                sendEmail(User.FindFirst(ClaimTypes.Email)?.Value, username, logLink);
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }

            return Ok();
        }

        private ProjectLink GenerateProjectLink(Image image, string projectName)
        {
            return new ProjectLink()
            {
                ProjectName = projectName,
                IId = image.IId
            };
        }

        private Log GenerateLog(string logContext)
        {
            string[] uuid = Guid.NewGuid().ToString().Split("-");
            return new Log()
            {
                LId = "log_" + uuid[uuid.Length-1],
                UId = HttpContext.User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier"),
                CreatedDate =  DateTime.Now,
                LogFile = logContext
            };
        }

        private LogLink GenerateLogLink(Image image, Log log)
        {
            return new LogLink()
            {
                IId = image.IId,
                LId = log.LId
            };
        }

        private void sendEmail(string address, string username, string logLink)
        {
            var fromAddress = new MailAddress("nlgpsag@gmail.com", "iHub");
            var toAddress = new MailAddress(address, username);
            const string password = "ulxozhttrefuudqs";
            const string subject = "Imagehub Submission Log";
            var body = "Hello " + username + "\nHere is your submission log " + logLink;
            
            var client = new SmtpClient {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network, 
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, password)
            };
            
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                client.Send(message);
            }
        }
    }
}

