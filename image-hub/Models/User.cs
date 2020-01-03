using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ImageHub.Models
{
    public partial class User
    {
        public User()
        {
            Image = new HashSet<Image>();
            Log = new HashSet<Log>();
        }

        public string UId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public bool Active { get; set; }

        public ICollection<Image> Image { get; set; }
        
        [JsonIgnore]
        public ICollection<Log> Log { get; set; }
    }
}
