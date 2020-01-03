using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHub.Models
{
    public class Submission
    {
        [JsonProperty("project")]
        public string Project;
        
        [JsonProperty("images")]
        public List<string> Images;
    }
}