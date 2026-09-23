# Hugging Face Spaces Dockerfile for F1 ML Engine (v4.0.0)
FROM python:3.11-slim

# Prevent Python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FASTF1_CACHE_DIR=/app/cache

# Set up working directory
WORKDIR /app

# Install system dependencies if required by numpy/scipy/pandas
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (UID 1000 is required by Hugging Face Spaces)
RUN useradd -m -u 1000 user && \
    mkdir -p /app/cache && \
    chown -R user:user /app

# Copy requirements and install dependencies
COPY --chown=user:user requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY --chown=user:user . .

# Switch to non-root user
USER user

# Expose port 7860 (Hugging Face default port)
EXPOSE 7860

# Health check for uptime monitoring (prevents 48h sleep cold starts)
HEALTHCHECK --interval=300s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:7860/health || exit 1

# Start FastAPI Uvicorn server on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
