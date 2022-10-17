var greets = require('../server/proto/greet_pb')
var service = require('../server/proto/greet_grpc_pb')

var grpc = require('grpc')

/*
 * Implements the greet RPC method
 */

function greet(call, callback) {
  var greeting = new greets.GreetResponse()

  greeting.setResult(
    "hello " + call.request.getGreeting().getFirstName() + call.request.getGreeting().getLastName()
  )

  callback(null, greeting)
}

function main() {
  var server = new grpc.Server()
  server.addService(service.GreetServiceService, {greet: greet})

  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on 0.0.0.0:50051')
}

main()
