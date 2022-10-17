var greets = require('../server/proto/greet_pb')
var service = require('../server/proto/greet_grpc_pb')

var grpc = require('grpc')


function main() {

  var client = new service.GreetServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )

  var request = new greets.GreetRequest()

  var greeting = new greets.Greeting()
  greeting.setFirstName('Jerry')
  greeting.setLastName('Tom')

  request.setGreeting(greeting)

  client.greet(request, (err, res) => {
    if (!err) {
      console.log(res.getResult())
    } else {
      console.error(err)
    }
  })
}
main()
