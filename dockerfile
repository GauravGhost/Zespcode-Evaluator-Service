FROM node:18-alpine

RUN apk add --no-cache git

WORKDIR /app

RUN git clone https://github.com/GauravGhost/Zespcode-Evaluator-Service.git .

RUN npm install

CMD ["npm", "run", "dev"]