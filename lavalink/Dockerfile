# Start from a minimal base image, e.g., Ubuntu
FROM ubuntu:22.04

# Install OpenJDK 21
RUN apt update && apt install -y openjdk-21-jdk

# Set the working directory in the container
WORKDIR /app

# Copy Lavalink.jar or bot files into the container
COPY . /app
# Or for your bot:
# COPY . /app

# Expose the necessary port for Lavalink or your bot
EXPOSE 2333

# Run the Java command to start Lavalink or bot
CMD ["java", "-jar", "Lavalink.jar"]
# For your Discord bot, use:
