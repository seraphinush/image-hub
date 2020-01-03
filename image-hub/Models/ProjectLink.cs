using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace ImageHub.Models
{
    public partial class ProjectLink
    {
        public int PlinkId { get; set; }
        public string ProjectName { get; set; }
        public string IId { get; set; }

        //[JsonIgnore]
        public Image I { get; set; }
        [JsonIgnore]
        public Project ProjectNameNavigation { get; set; }
    }
}
