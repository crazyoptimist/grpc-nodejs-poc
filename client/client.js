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

function callGreetManyTimes() {
  var client = new greetService.GreetServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )

  var request = new greets.GreetManyTimesRequest()

  var greeting = new greets.Greeting()
  greeting.setFirstName('John')
  greeting.setLastName('Dichone')

  request.setGreeting(greeting)

  var call = client.greetManyTimes(request, () => {})

  call.on('data', (response) => {
    console.log(response.getResult())
  })

  call.on('status', (status) => {
    console.log(status)
  })

  call.on('error', (error) => {
    console.log(error)
  })

  call.on('end', () => {
    console.log('Streaming Ended')
  })
}

function callLongGreet() {
  var client = new greetService.GreetServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )

  var request = new greets.LongGreetRequest()
  var call = client.longGreet(request, (error, response) => {
    if (!error) {
      console.log(response.getResult())
    } else {
      console.error(error)
    }
  })

  let count = 0, intervalID = setInterval(function() {
    console.log('Sending message ' + count)

    var request = new greets.LongGreetRequest()
    var greeting = new greets.Greeting()
    greeting.setFirstName('John')
    greeting.setLastName('Doe')

    request.setGreet(greeting)

    call.write(request)

    if (++count > 9) {
      clearInterval(intervalID)
      call.end() // we went all the messages, we are done!
    }
  }, 1000)
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


function callPrimeNumberDecomposition() {
  var client = new calcService.CalculatorServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )

  var request = new calc.PrimeNumberDecompositionRequest()

  var number = 1234443

  request.setNumber(number)

  var call = client.primeNumberDecomposition(request, () => {})

  call.on('data', (response) => {
    console.log(response.getPrimeFactor())
  })

  call.on('status', (status) => {
    console.log(status)
  })

  call.on('error', (error) => {
    console.log(error)
  })

  call.on('end', () => {
    console.log('Streaming Ended')
  })
}

function main() {
  callLongGreet()
}
main()
