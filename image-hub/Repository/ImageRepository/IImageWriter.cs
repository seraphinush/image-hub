using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace ImageHub.Repository
{
    public interface IImageWriter
    {
        string StoreImage(IFormFile file);
    }
}

