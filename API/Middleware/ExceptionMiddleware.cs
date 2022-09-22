using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next; // what's next, what's coming next in the pipeline
        private readonly ILogger<ExceptionMiddleware> _logger; // to logout error in the terminal, to display it
        private readonly IHostEnvironment _env; // check if we are in production or environnement
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, 
            IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        // happening in a HTTP context
        // for the 500 server error : 
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // pass our request to our next piece of middleware until there is an exception
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                    ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString()) // StrackTrace? = if null we ignore it
                    : new ApiException(context.Response.StatusCode, "Internal Server Error");

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase}; // we make sure to have a good json format

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}