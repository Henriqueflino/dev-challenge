# Seed - Full Stack Developer Challenge

Este projeto utiliza Angular, Node.js (Framework Express) e MongoDB.

Para rodar o MongoDB no Docker, execute os seguintes comandos: 

Na pasta raiz do projeto, onde está o arquivo docker-compose.yml, execute:

`docker-compose up`

Após isso é necessário incluir os dados disponíveis na pasta "dump". Para isso execute:

`sudo docker cp <pasta_do_projeto>/dump backend_mongo_1:/dump`

E em seguida:

`sudo docker exec -i backend_mongo_1 /usr/bin/mongorestore --username root --password seed --authenticationDatabase admin --db multisearch /dump/multisearch`


Agora basta rodar o angular com `npm install` e `ng serve`

Para rodar o backend: `node index.js`