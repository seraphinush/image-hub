FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ["image-hub/ImageHub.csproj", "image-hub/"]
RUN dotnet restore "image-hub/ImageHub.csproj"
COPY . .
WORKDIR "/src/ImageHub"
RUN dotnet build "ImageHub.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "ImageHub.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ImageHub.dll"]