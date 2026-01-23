# --- Stage 1: Build the Application ---
# Start with a Linux server that has Maven and Java 17 installed
#FROM maven:3.8.5-openjdk-17 AS build
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Create a folder inside the container
WORKDIR /app

# Copy your project files into the container
COPY . .

# Run the build command (skip tests to save time)
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
# Start fresh with a tiny, lightweight Java runtime (no Maven junk)
#FROM openjdk:17-jdk-slim
FROM eclipse-temurin:21-jre-alpine
# Copy only the compiled JAR file from the "build" stage
COPY --from=build /app/target/*.jar app.jar

# Open port 8080 (so we can access it)
EXPOSE 8080

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]