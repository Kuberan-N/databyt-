FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY support_agent/ ./support_agent/

ENV PORT=8080
EXPOSE 8080

CMD python -m google.adk.cli api_server --host 0.0.0.0 --port $PORT support_agent
