FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy all your code and files (including .env and requirements.txt)
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
