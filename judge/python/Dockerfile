FROM python:3.11-alpine

WORKDIR /src
RUN apk add --no-cache bash

# Copier main.py dans /src du container
COPY main.py .

# Créer un utilisateur non-root
RUN adduser -D runner
USER runner

CMD ["python", "main.py"]
