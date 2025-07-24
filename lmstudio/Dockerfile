FROM ubuntu:22.04

# Install necessary libs for AppImage
RUN apt-get update && apt-get install -y \
    libgtk-3-0 libgdk-pixbuf2.0-0 libasound2 libxcomposite1 \
    libxdamage1 libxrandr2 fuse wget && \
    apt-get clean

WORKDIR /app

# Download and setup LM Studio AppImage
RUN wget -O lmstudio.AppImage "https://installers.lmstudio.ai/linux/x64/0.3.15-11/LM-Studio-0.3.15-11-x64.AppImage" && \
    chmod +x lmstudio.AppImage

EXPOSE 1234

# Run LM Studio in headless (local LLM service) mode
CMD ["./lmstudio.AppImage", "--api"]
