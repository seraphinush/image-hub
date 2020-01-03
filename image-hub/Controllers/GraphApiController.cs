using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ImageHub.Controllers
{
    [Authorize (Policy = "Admins")]
    [Route("api/graph")]
    public class GraphApiController : ControllerBase
    {
        private readonly GraphServiceClient _graphClient;

        private const string ClientId = "a42cbd10-bbd7-414f-b9f8-733274fea3c1";
        private const string ClientSecret = "j90fFmg7MZAqZkSVMrm1PyffNdVnxAAu7Nvp1H01YvE=";
        private const string RedirectUri = "http://localhost:5000";
        private const string Authority = "https://login.microsoftonline.com/80698aee-cfad-4328-9c3a-2c38a08a5ee2/v2.0";
        private readonly ConfidentialClientApplication _cca;
        private readonly List<string> _scopes = new List<string>();
        
        public GraphApiController()
        {
             _cca = new ConfidentialClientApplication(ClientId, Authority, RedirectUri, 
                new ClientCredential(ClientSecret), null, null);
            _scopes.Add("https://graph.microsoft.com/.default");   
            var authenticationProvider = new MsalAuthenticationProvider(_cca, _scopes.ToArray());
             _graphClient = new GraphServiceClient(authenticationProvider);

        }
        
        /**
         * GET
        API Endpoint: api/graph
        Description: Get users in azureAD as a json object
        Request Requirements:
        1. A valid JWT token of an admin user

        Server response and status code:
        Standard status code
         */
        [HttpGet]
        public object GetUsers()
        {
            return JsonConvert.SerializeObject(_graphClient.Users.Request().GetAsync().Result);
        }


        /**
         * Post
        API Endpoint: api/graph/:oid
        Description: Make a non-admin user an admin
        Request Requirements:
        1. A valid JWT token of an admin user

        Server response and status code:
        202 - accepted
        400 - bad request : user is already an admin
         */
        [HttpPut("{oid}")]
        public IActionResult EditUsers(string oid)
        {
            const string adminGroup = "abcdefgh-ijkl-mnop-qrst-uvwxyz123456";
            var usersGroups = _graphClient.Users[oid].MemberOf.Request().GetAsync().Result;
          
            if (!usersGroups.Any(g => g is Group && g.Id == adminGroup)){
                var user = _graphClient.Users[oid].Request().Select("id").GetAsync().Result;
                 _graphClient.Groups[adminGroup].Members.References.Request().AddAsync(user);
                return Accepted();
            }
            return BadRequest("User is already an Admin");
        }
        
        /**
        * Post
        API Endpoint: api/graph/:oid
        Description: Invites a guest user
        Request Requirements:
        1. A valid JWT token of an admin user

        Server response and status code:
        200 - OK
        400 - bad request : user is already an admin
        */
        [HttpPost("{email}")]
        public IActionResult CreateGuestUser(string email, [FromBody] JObject payload)
        {
            var invitation = new Invitation
            {
                SendInvitationMessage = true,
                InvitedUserEmailAddress = email,
                InviteRedirectUrl = "https://aeimagehub.azurewebsites.net/"
            };
            
            var result = _graphClient.Invitations.Request().AddAsync(invitation).Result;
            return Ok();
        }
        
        /**
        * Post
        API Endpoint: api/graph/:oid
        Description: Create a new user
        Request Requirements:
        1. A valid JWT token of an admin user

        Server response and status code:
        200 - returns the password of the newly created user
        400 - bad request
        */
        [HttpPost("")]
        public Object CreateUser([FromBody] JObject payload)
        {
            var password = CreatePassword(5);
            var passwordProfile = new PasswordProfile
            {
                Password = password
            };
            try
            {
                var newUser = new User
                {
                    AccountEnabled = true,
                    DisplayName = (string) payload["displayName"],
                    GivenName = (string) payload["givenName"],
                    Surname = (string) payload["surname"],
                    MailNickname = (string) payload["mailNickname"],
                    UserPrincipalName = (string) payload["userPrincipalName"],
                    PasswordProfile = passwordProfile
                };
                Console.WriteLine("Password is: " + password);
                var result =  _graphClient.Users.Request().AddAsync(newUser).Result;
                return password;
            }
            catch (Exception e)
            {
                Console.WriteLine("Reached");
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{oid}")]
        public async Task<IActionResult> DeleteUser(string oid)
        {
            await _graphClient.Users[oid].Request().DeleteAsync();
            return Ok();
        }
        private static string CreatePassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var res = new StringBuilder();
            var rnd = new Random();
            res.Append("ksB1@");
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }
    }
}