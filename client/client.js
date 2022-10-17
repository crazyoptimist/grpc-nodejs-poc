var greets = require('../server/proto/greet_pb')
var greetService = require('../server/proto/greet_grpc_pb')

var calc = require('../server/proto/calculator_pb')
var calcService = require('../server/proto/calculator_grpc_pb')

var grpc = require('grpc')

function callGreet() {
  var client = new greetService.GreetServiceClient(
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

function callSum() {
  var client = new calcService.CalculatorServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )

  var request = new calc.SumRequest()

  request.setFirstNumber(10)
  request.setSecondNumber(3)

  client.sum(request, (err, res) => {
    if (!err) {
      console.log(request.getFirstNumber() + " + " + request.getSecondNumber() + " = " + res.getSumResult())
    } else {
      console.error(err)
    }
  })

}

function main() {
  callSum()
}
main()
