const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const WindyAPI = require('./windy')
require('dotenv').config()


// type Weather {
//     temperature: Float
//     description: String
//     feels_like: Float
//     temp_min: Float
//     temp_max: Float
//     pressure: Float
//     humidity: Float
//     cod: Int
//     message: String
// }
//
// type Query {
//     getWeather(zip: Int!, units: Units): Weather!
// }
const schema = buildSchema(`
  enum Units {
      standard
      metric
      imperial
  }
`)

const root = {
    // getWeather: async ({ lat, lon }) => {
    //     const res = await WindyAPI.standard(lat, lon, process.env.WINDY_API_KEY)
    //     console.log(res)
    //     return res
    // }
}

const app = express()

// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

const port = process.env.PORT || 5000
app.listen(port, async () => {
    console.log('Server running on port: ' + port)
    const res = await WindyAPI.standard(49.809, 16.787, process.env.WINDY_API_KEY)
    console.log(res)
})
