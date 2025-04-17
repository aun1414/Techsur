# Step 1: Use a Maven image to build the Spring Boot app
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy all project files into container
COPY . .

# Build the Spring Boot app 
RUN mvn clean package -DskipTests

# Step 2: Use a lightweight Java image to run the built JAR
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

# Copy the jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Add wait script
COPY wait-for-postgres.sh .
RUN chmod +x wait-for-postgres.sh

ENTRYPOINT ["./wait-for-postgres.sh", "db", "java", "-jar", "app.jar"]