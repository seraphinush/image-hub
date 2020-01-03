using System;
using System.Collections.Generic;

namespace ImageHub.Models
{
    public partial class LogLink
    {
        public int LlinkId { get; set; }
        public string LId { get; set; }
        public string IId { get; set; }

        public Image I { get; set; }
        public Log L { get; set; }
    }
}
