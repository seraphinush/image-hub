using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Graph;
using Microsoft.Identity.Client;

namespace ImageHub.Controllers
{
    public class MsalAuthenticationProvider : IAuthenticationProvider
    {
        private readonly ConfidentialClientApplication _clientApplication;
        private readonly string[] _scopes;

        public MsalAuthenticationProvider(ConfidentialClientApplication clientApplication, string[] scopes) {
            _clientApplication = clientApplication;
            _scopes = scopes;
        }

        public async Task AuthenticateRequestAsync(HttpRequestMessage request)
        {
            var token = await GetTokenAsync();
            request.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);
        }

        public async Task<string> GetTokenAsync()
        {
            AuthenticationResult authResult = null;
            authResult = await _clientApplication.AcquireTokenForClientAsync(_scopes);
            return authResult.AccessToken;
        }
    }
}