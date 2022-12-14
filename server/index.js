var greets = require('../server/proto/greet_pb')
var greetService = require('../server/proto/greet_grpc_pb')

var calc = require('../server/proto/calculator_pb')
var calcService = require('../server/proto/calculator_grpc_pb')

var blogs = require('../server/proto/blog_pb')
var blogService = require('../server/proto/blog_grpc_pb')

var grpc = require('grpc')
const fs = require('fs')

// Knex requires
const environment = process.env.ENVIRONMENT || 'development'
const config = require('./knex')[environment]
const knex = require('knex')(config)

// Blog CRUD RPC methods

function listBlog(call, callback) {
  knex('blogs').then(data => {

    data.forEach(item => {
      const blog = new blogs.Blog()
      blog.setId(item.id)
      blog.setAuthor(item.author)
      blog.setTitle(item.title)
      blog.setContent(item.content)

      const blogResponse = new blogs.ListBlogResponse()
      blogResponse.setBlog(blog)

      call.write(blogResponse)
    })

    call.end()
  })

}


// Implements RPC methods

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

async function sleep(interval) {
  return new Promise( resolve => {
    setTimeout(() => resolve(), interval)
  } )
}

exports.sleep = sleep

async function greetEveryone(call, callback) {
  let names = []
  call.on('data', response => {
    const fullName = response.getGreeting().getFirstName() + " " + response.getGreeting().getLastName()
    console.log('Received ', fullName)

    names.push(fullName)
  })

  call.on('error', error => console.error(error))

  call.on('end', () => {
    console.log('The End...')
  })

  await sleep(3000)
  for (let i=0; i<10; i++) {
    const response = new greets.GreetEveryoneResponse()
    response.setResult(`Hello, ${i} - ${names[i]} !`)
    call.write(response)
  }
  call.end()
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

function computeAverage(call, callback) {
  let sum = 0
  let length = 0
  call.on('data', request => {
    sum += request.getNumber()
    length ++

    console.log('Recieved ' + request.getNumber())
  })

  call.on('error', error => console.error(error))

  call.on('end', () => {
    const response = new calc.ComputeAverageResponse()
    response.setAverage(sum / length)

    callback(null, response)
  })

}

function findMaximum(call, callback) {
  let currentMaximum = Number.NEGATIVE_INFINITY

  call.on('data', (request) => {
    console.log("Received: " + request.getNumber())

    if (currentMaximum < request.getNumber()) {
      currentMaximum = request.getNumber()

      const response = new calc.FindMaximumResponse()
      response.setMaximum(currentMaximum)

      call.write(response)
    }
  })

  call.on('error', err => console.error(err))

  call.on('end', () => {
    call.end()
  })
}

function squareRoot(call, callback) {
  const number = call.request.getNumber()

  if (number >= 0) {
    const numberRoot = Math.sqrt(number)

    const response = new calc.SquareRootResponse()
    response.setNumberRoot(numberRoot)

    callback(null, response)
  } else {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: `The number being sent is not positive: ${number}`
    })
  }
}


function main() {
  var server = new grpc.Server()

  // server.addService(greetService.GreetServiceService, {
  //   greet,
  //   greetManyTimes,
  //   longGreet,
  //   greetEveryone,
  // })

  // server.addService(calcService.CalculatorServiceService, {
  //   sum,
  //   primeNumberDecomposition,
  //   computeAverage,
  //   findMaximum,
  //   squareRoot,
  // })

  server.addService(blogService.BlogServiceService, {
    listBlog,
  })

  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on 0.0.0.0:50051')
}

main()
