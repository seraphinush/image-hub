using System;
using System.Collections.Generic;

namespace ImageHub.Models
{
    public partial class Log
    {
        public Log()
        {
            LogLink = new HashSet<LogLink>();
        }

        public string LId { get; set; }
        public string UId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LogFile { get; set; }

        public User U { get; set; }
        public ICollection<LogLink> LogLink { get; set; }
    }
}
