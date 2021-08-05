FROM node:16.6.0
COPY ./ ./app
WORKDIR /app
RUN npm run build-prod 
EXPOSE 5000
CMD npm run start:prod