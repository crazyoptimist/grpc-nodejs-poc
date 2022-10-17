var greets = require('../server/proto/greet_pb')
var greetService = require('../server/proto/greet_grpc_pb')

var calc = require('../server/proto/calculator_pb')
var calcService = require('../server/proto/calculator_grpc_pb')

var grpc = require('grpc')


function greet(call, callback) {
  var greeting = new greets.GreetResponse()

  greeting.setResult(
    "hello " + call.request.getGreeting().getFirstName() + call.request.getGreeting().getLastName()
  )

  callback(null, greeting)
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

function longGreet(call, callback) {
  call.on('data', request => {
    var fullName = request.getGreet().getFirstName() + " " + request.getGreet().getLastName()

    console.log('Hello, ' + fullName)
  })

  call.on('error', error => console.error(error))

  call.on('end', () => {
    var response = new greets.LongGreetResponse()
    response.setResult('Long Greet Client Streaming.....')

    callback(null, response)
  })
}

function sum(call, callback) {
  var sumResponse = new calc.SumResponse()

  sumResponse.setSumResult(
    call.request.getFirstNumber() + call.request.getSecondNumber()
  )

  callback(null, sumResponse)
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
  server.addService(greetService.GreetServiceService, { greet, greetManyTimes, longGreet })
  // server.addService(calcService.CalculatorServiceService, { sum, primeNumberDecomposition })

  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on 0.0.0.0:50051')
}

main()
