## Subir containers
```docker-compose up -d```

## Acessar container
```docker exec -it simulator bash```
```docker exec -it kafka_kafka_1 bash```


### Comandos executados no container

```
go mod init github.com/codeedu/imersaofsfc2-simulator

```

## Ver mensagens em um topico
```kafka-console-consumer --bootstrap-server=localhost:9092 --topic=readtest```

## Mandar mensages para um topico
```kafka-console-producer --bootstrap-server=localhost:9092 --topic=readtest```

