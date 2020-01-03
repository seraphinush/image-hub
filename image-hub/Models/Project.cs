using System;
using System.Collections.Generic;

namespace ImageHub.Models
{
    public partial class Project
    {
        public Project()
        {
            ProjectLink = new HashSet<ProjectLink>();
        }

        public string ProjectName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }

        public ICollection<ProjectLink> ProjectLink { get; set; }
    }
}
