using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore;
using ImageHub.Models;

namespace ImageHub.Controllers
{
    [Authorize]
    [Route("api/search")]
    public class SearchController : ControllerBase
    {
        private readonly ihubDBContext _context;

        public SearchController(ihubDBContext context)
        {
            _context = context;
        }

        /*
        GET
        API Endpoint: api/search/[metadata]/:[keyword]
        Description: Searches images with [keyword] of [metadata]
        Request Requirements:
        1. User JWT in header field

        Server response and status code:
        200 - search success server should return search results
        401 - the JWT attached to the header is invalid or expired (should redirect to login)
        */
        [HttpGet("image/{imagename}")]
        public Object GetImagesWithImagename(string imagename)
        {
            try
            {
                if (imagename.Contains("\""))
                {
                    imagename = imagename.Replace("\"", "");
                    var images = this.CreateImageModel()
                        .Where(i => i.ImageName == imagename && i.Submitted && !i.Trashed);

                    return JsonConvert.SerializeObject(images);
                }
                else
                {      
                    var images = this.CreateImageModel()
                        .Where(i => i.ImageName.Contains(imagename) && i.Submitted && !i.Trashed).ToHashSet();

                    return JsonConvert.SerializeObject(images);
                }

            }
            catch (Exception e)
            {
                return e;
            }
        }

        [HttpGet("tag/{tagname}")]
        public Object GetImagesWithTagname(string tagname)
        {
            try
            {
                HashSet<TagLink> taglinks;
                if (!tagname.Contains("\""))
                {
                    taglinks = _context.TagLink.Select(tl => new TagLink
                    {
                        TlinkId = tl.TlinkId,
                        TagName = tl.TagName,
                        I = tl.I
                    }).Where(tl => tl.TagName.Contains(tagname)).ToHashSet();
                }
                else
                {
                    tagname = tagname.Replace("\"", "");
                    taglinks = _context.TagLink.Select(tl => new TagLink
                    {
                        TlinkId = tl.TlinkId,
                        TagName = tl.TagName,
                        IId = tl.IId,
                        I = tl.I
                    })
                    .Where(tl => tl.TagName == tagname).ToHashSet();
                }

                var images = new HashSet<Image>();

                foreach (var tl in taglinks)
                {
                    if (tl.I.Submitted && !tl.I.Trashed)
                    {
                        tl.I.TagLink = _context.TagLink.Select(tl2 => new TagLink
                        {
                            TlinkId = tl2.TlinkId,
                            TagName = tl2.TagName,
                            IId = tl2.IId,
                        }).Where(tl2 => tl2.IId == tl.I.IId).ToList();
                        tl.I.ProjectLink = _context.ProjectLink.Select(pl2 => new ProjectLink
                        {
                            PlinkId = pl2.PlinkId,
                            ProjectName = pl2.ProjectName,
                            IId = pl2.IId,
                        }).Where(pl2 => pl2.IId == tl.I.IId).ToList();
                        tl.I.U = _context.User.Select(u2 => new User
                        {
                            UId = u2.UId,
                            UserName = u2.UserName
                        }).Where(u2 => u2.UId == tl.I.UId).First();
                        images.Add(tl.I);
                    }
                }
                return JsonConvert.SerializeObject(images);
            }
            catch (Exception e)
            {
                return e;
            }
        }

        [HttpGet("project/{projectname}")]
        public Object GetImagesWithProjectname(string projectname)
        {
            HashSet<ProjectLink> projectlinks;
            try
            {
                if (!projectname.Contains("\""))
                {
                    projectlinks = _context.ProjectLink.Select(pl => new ProjectLink
                    {
                        PlinkId = pl.PlinkId,
                        ProjectName = pl.ProjectName,
                        I = pl.I
                    }).Where(pl => pl.ProjectName.Contains(projectname)).ToHashSet();
                }
                else
                {
                    projectname = projectname.Replace("\"", "");
                    projectlinks = _context.ProjectLink.Select(pl => new ProjectLink
                    {
                        PlinkId = pl.PlinkId,
                        ProjectName = pl.ProjectName,
                        I = pl.I
                    }).Where(pl => pl.ProjectName == projectname).ToHashSet();
                }

                var images = new HashSet<Image>();
                foreach (var pl in projectlinks)
                {
                    if (pl.I.Submitted && !pl.I.Trashed)
                    {
                        pl.I.TagLink = _context.TagLink.Select(tl2 => new TagLink
                        {
                            TlinkId = tl2.TlinkId,
                            TagName = tl2.TagName,
                            IId = tl2.IId,
                        }).Where(tl2 => tl2.IId == pl.I.IId).ToHashSet();
                        pl.I.ProjectLink = _context.ProjectLink.Select(pl2 => new ProjectLink
                        {
                            PlinkId = pl2.PlinkId,
                            ProjectName = pl2.ProjectName,
                            IId = pl2.IId,
                        }).Where(pl2 => pl2.IId == pl.I.IId).ToHashSet();
                        pl.I.U = _context.User.Select(u2 => new User
                        {
                            UId = u2.UId,
                            UserName = u2.UserName
                        }).Where(u2 => u2.UId == pl.I.UId).First();
                        images.Add(pl.I);
                    }
                }

                return JsonConvert.SerializeObject(images);

            }
            catch (Exception e)
            {
                return e;
            }
        }

        [HttpGet("user/{username}")]
        public Object GetImagesWithUsername(string username)
        {
            try
            {
                HashSet<User> users;
                if (!username.Contains("\""))
                {
                    users = _context.User.Select(u => new User
                    {
                        UId = u.UId,
                        UserName = u.UserName,
                        Image = u.Image
                    }).Where(u => u.UserName.Contains(username)).ToHashSet();
                }
                else
                {
                    username = username.Replace("\"", "");
                    users = _context.User.Select(u => new User
                    {
                        UId = u.UId,
                        UserName = u.UserName,
                        Image = u.Image
                    }).Where(u => u.UserName == username).ToHashSet();
                }


                var images = new HashSet<Image>();
                foreach (var u in users)
                {
                    foreach (var i in u.Image)
                    {
                        if (i.Submitted && !i.Trashed)
                        {
                            i.TagLink = _context.TagLink.Select(tl2 => new TagLink
                            {
                                TlinkId = tl2.TlinkId,
                                TagName = tl2.TagName,
                                IId = tl2.IId,
                            }).Where(tl2 => tl2.IId == i.IId).ToList();
                            i.ProjectLink = _context.ProjectLink.Select(pl2 => new ProjectLink
                            {
                                PlinkId = pl2.PlinkId,
                                ProjectName = pl2.ProjectName,
                                IId = pl2.IId,
                            }).Where(pl2 => pl2.IId == i.IId).ToList();
                            i.U = _context.User.Select(u2 => new User
                            {
                                UId = u2.UId,
                                UserName = u2.UserName
                            }).Where(u2 => u2.UId == i.UId).First();
                            images.Add(i);
                        }
                    }
                }
                return JsonConvert.SerializeObject(images);
            }
            catch (Exception e)
            {
                return e;
            }
        }

        [HttpGet("date/{udate}")]
        public Object GetImagesWithUploadedDate(string udate)
        {
            try
            {
                DateTime startDate = DateTime.Parse(udate.Substring(4, 2) + "/" + udate.Substring(6, 2) + "/" + udate.Substring(0, 4) + " 00:00:00");
                DateTime endDate = DateTime.Parse(udate.Substring(12, 2) + "/" + udate.Substring(14, 2) + "/" + udate.Substring(8, 4) + " 23:59:59");
                var images = this.CreateImageModel()
                                    .Where(i => i.UploadedDate >= startDate && i.UploadedDate <= endDate && i.Submitted && !i.Trashed);
                return JsonConvert.SerializeObject(images);
            }
            catch (Exception e)
            {
                return e;
            }
        }

        private IQueryable<Image> CreateImageModel()
        {
            return _context.Image.Select(i => new Image
            {
                IId = i.IId,
                UId = i.UId,
                ImageName = i.ImageName,
                Size = i.Size,
                UploadedDate = i.UploadedDate,
                Type = i.Type,
                Trashed = i.Trashed,
                TrashedDate = i.TrashedDate,
                Submitted = i.Submitted,
                U = i.U,
                ProjectLink = i.ProjectLink,
                TagLink = i.TagLink
            });
        }
    }
}