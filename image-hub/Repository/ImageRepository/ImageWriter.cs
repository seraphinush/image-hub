using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;

namespace ImageHub.Repository
{
    public class ImageWriter : IImageWriter
    {
        public string StoreImage(IFormFile file)
        {
            if (CheckIfImageFile(file))
            {
                return WriteFile(file);
            }
            else
            {
                throw new InvalidImageTypeException();
            }
        }

        /// <summary>
        /// Method to check if file is image file
        /// </summary>
        private bool CheckIfImageFile(IFormFile file)
        {
            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                fileBytes = ms.ToArray();
            }

            return WriterHelper.GetImageFormat(fileBytes) != WriterHelper.ImageFormat.unknown;
        }

        /// <summary>
        /// Method to convert file to MD5 hash
        /// </summary>
        public static String GetImageHash(IFormFile file)
        {
            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                fileBytes = ms.ToArray();
            }
            // hash the bytes
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            byte[] hash = md5.ComputeHash(fileBytes);

            // make a hex string of the hash for display or whatever
            StringBuilder sb = new StringBuilder();
            foreach (byte b in hash)
            {
                sb.Append(b.ToString("x2").ToLower());
            }
            return sb.ToString();

        }

        /// <summary>
        /// Method to write file onto disk
        /// </summary>
        private string WriteFile(IFormFile file)
        {
            string fileName = GetImageHash(file);

            var dir = Path.Combine(Directory.GetCurrentDirectory(), "ImageResources");
            var path = Path.Combine(Directory.GetCurrentDirectory(), "ImageResources", fileName);
            bool exists = Directory.Exists(dir);
            if (!exists)
            {
                Directory.CreateDirectory(dir);
            }

            using (var bits = new FileStream(path, FileMode.Create))
            {
                file.CopyTo(bits);
            }
            return fileName;
        }
    }
}

