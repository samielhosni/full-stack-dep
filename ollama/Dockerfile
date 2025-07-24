FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y curl unzip wget

# Set working directory
WORKDIR /app

# Download LM Studio (ex: binary or server version - replace with real URL)
# If LM Studio provides a .deb or binary, use that instead
COPY lmstudio-linux ./lmstudio
RUN chmod +x ./lmstudio

EXPOSE 1234

CMD ["./lmstudio"]
