using Microsoft.AspNetCore.Http;
using System.IO;

namespace ImageHub.Repository
{
    public class ImageRepository : IImageRepository
    {
        IImageWriter _imageWriter;

        public ImageRepository(IImageWriter imageWriter)
        {
            _imageWriter = imageWriter;
        }

        /// <summary>
        /// Stores image onto disk
        /// </summary>
        public string StoreImageToDisk(IFormFile file)
        {
            return _imageWriter.StoreImage(file);
        }

        /// <summary>
        /// Gets the file extension of a file
        /// </summary>
        public string GetFileExtension(IFormFile file)
        {
            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                fileBytes = ms.ToArray();
            }
            return WriterHelper.GetImageFormat(fileBytes).ToString();
        }

        /// <summary>
        /// Checks if file is an image
        /// </summary>
        public bool IsImageFileType(IFormFile file)
        {
            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                fileBytes = ms.ToArray();
            }
            return WriterHelper.GetImageFormat(fileBytes) != WriterHelper.ImageFormat.unknown;
        }
    }
}
