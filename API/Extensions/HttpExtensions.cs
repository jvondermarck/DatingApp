using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Helpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase // totalPages instead of TotalPages
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, options)); // --> pagination: {"currentPage":1,"itemsPerPage":10,"totalItems":12,"totalPages":2}
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); // --> access-control-expose-headers: Pagination
        }
    }
}