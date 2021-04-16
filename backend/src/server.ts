const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const WindyAPI = require('@tsamantanis/node-windy-api')
require('dotenv').config()


const schema = buildSchema(`
    type Units {
        tempSurface: String!
        winduSurface: String!
        windvSurface: String!
        rhSurface: String!
    }

    type Weather {
        ts: [Float!]
        units: Units
        tempSurface: [Float]
        winduSurface: [Float]
        windvSurface: [Float]
        rhSurface: [Float]
        humanizedTime: [String!]
        humanizedTempSurface: [String!]
        humanizedWinduSurface: [String!]
        humanizedWindvSurface: [String!]
        humanizedRhSurface: [String!]
    }

    type Query {
        getWeather(lat: Float!, lon: Float!): Weather!
        getHumanizedWeather(lat: Float!, lon: Float!, time: String, temp: String, wind: String): Weather!
    }
`)

const root = {
    getWeather: async ({ lat, lon }) => {
        const res = await WindyAPI.standard(lat, lon, process.env.WINDY_API_KEY)
        return {
            ts: res.ts,
            units: {
                tempSurface: res.units['temp-surface'],
                winduSurface: res.units['wind_u-surface'],
                windvSurface: res.units['wind_v-surface'],
                rhSurface: res.units['rh-surface'],
            },
            tempSurface: res['temp-surface'],
            winduSurface: res['wind_u-surface'],
            windvSurface: res['wind_v-surface'],
            rhSurface: res['rh-surface'],
        }
    },
    getHumanizedWeather: async ({ lat, lon, time, temp, wind }) => {
        const res = await WindyAPI.standard(lat, lon, process.env.WINDY_API_KEY)
        const data = await WindyAPI.beautify(res, time, temp, wind)
        return {
            ts: res.ts,
            humanizedTime: data.ts,
            humanizedTempSurface: data['temp-surface'],
            humanizedWinduSurface: data['wind_u-surface'],
            humanizedWindvSurface: data['wind_v-surface'],
            humanizedRhSurface: data['rh-surface'],
        }
    }
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
})
