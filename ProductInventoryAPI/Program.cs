using Microsoft.AspNetCore.Http.Json;
using ProductInventoryAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
});

// Generates the OpenAPI document used by Swagger UI.
builder.Services.AddOpenApi();

// One ProductStore instance is shared while the API is running.
builder.Services.AddSingleton<ProductStore>();

//Enabling CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy
.WithOrigins("http://localhost:4200")
.AllowAnyHeader()
.AllowAnyMethod();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
       options.SwaggerEndpoint(
                                "/openapi/v1.json",
                                "Product Inventoey API v1");

        options.RoutePrefix = "swagger";
    });

}

app.UseHttpsRedirection();

app.UseCors("AngularClient");

app.UseAuthorization();

app.MapControllers();

app.Run();
