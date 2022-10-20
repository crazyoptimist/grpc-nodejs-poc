# gRPC Node.js POC

### Generate code from protobuf

```bash
make generate proto=${file_name}
```

### Database migrations/seeds

Make a new migration file:
```bash
yarn knex migrate:make blogs
```

Make a new seed file:
```bash
yarn knex seed:make blogs
```

Everything is already in the knex doc :D
