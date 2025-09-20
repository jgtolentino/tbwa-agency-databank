FROM python:3.11-alpine

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Environment
ENV PORT=8001
EXPOSE 8001

# Run
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]