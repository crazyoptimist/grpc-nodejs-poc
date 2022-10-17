var greets = require('../server/proto/greet_pb')
var service = require('../server/proto/greet_grpc_pb')

var calc = require('../server/proto/calculator_pb')
var calcService = require('../server/proto/calculator_grpc_pb')

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

function sum(call, callback) {
  var sumResponse = new calc.SumResponse()

  sumResponse.setSumResult(
    call.request.getFirstNumber() + call.request.getSecondNumber()
  )

  callback(null, sumResponse)
}

function greetManyTimes(call, callback) {
  var firstName = call.request.getGreeting().getFirstName()

  let count = 0, intervalId = setInterval(function() {
    var greetManyTimesResponse = new greets.GreetManyTimesResponse()

    greetManyTimesResponse.setResult(firstName)


    // setup streaming
    call.write(greetManyTimesResponse)

    if (++count > 9) {
      clearInterval(intervalId)
      call.end()
    }
  }, 1000)
}

function primeNumberDecomposition(call, callback) {
  var number = call.request.getNumber()
  var divisor = 2

  while (number > 1) {
    if (number % divisor === 0) {
      var primeNumberDecompositionResponse = new calc.PrimeNumberDecompositionResponse()

      primeNumberDecompositionResponse.setPrimeFactor(divisor)

      number = number / divisor

      call.write(primeNumberDecompositionResponse)

    } else {
      divisor ++
      console.log('Divisor has increased to ', divisor)
    }
  }

  call.end() // all messages sent, we are done!
}

function main() {
  var server = new grpc.Server()
  // server.addService(service.GreetServiceService, { greet: greet, greetManyTimes: greetManyTimes })
  server.addService(calcService.CalculatorServiceService, { sum: sum, primeNumberDecomposition: primeNumberDecomposition })

  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on 0.0.0.0:50051')
}

main()
