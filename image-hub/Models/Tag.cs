using System;
using System.Collections.Generic;

namespace ImageHub.Models
{
    public partial class Tag
    {
        public Tag()
        {
            TagLink = new HashSet<TagLink>();
        }

        public string TagName { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }

        public ICollection<TagLink> TagLink { get; set; }
    }
}
