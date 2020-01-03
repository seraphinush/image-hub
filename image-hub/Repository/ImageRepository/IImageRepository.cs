using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace ImageHub.Repository
{
    public interface IImageRepository
    {
        string StoreImageToDisk(IFormFile file);

        string GetFileExtension(IFormFile file);

        bool IsImageFileType(IFormFile file);
    }
}
