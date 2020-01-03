using System;
using System.Collections.Generic;

namespace ImageHub.Models
{
    public partial class Image
    {
        public Image()
        {
            LogLink = new HashSet<LogLink>();
            ProjectLink = new HashSet<ProjectLink>();
            TagLink = new HashSet<TagLink>();
        }

        public string IId { get; set; }
        public string UId { get; set; }
        public string ImageName { get; set; }
        public int Size { get; set; }
        public DateTime UploadedDate { get; set; }
        public string Type { get; set; }
        public bool Trashed { get; set; }
        public DateTime? TrashedDate { get; set; }
        public bool Submitted { get; set; }
        public string UploadedBy { get; set; }

        public User U { get; set; }
        public ICollection<LogLink> LogLink { get; set; }
        public ICollection<ProjectLink> ProjectLink { get; set; }
        public ICollection<TagLink> TagLink { get; set; }
    }
}
