var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const WindyAPI = require('./windy');
require('dotenv').config();
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
`);
const root = {
// getWeather: async ({ lat, lon }) => {
//     const res = await WindyAPI.standard(lat, lon, process.env.WINDY_API_KEY)
//     console.log(res)
//     return res
// }
};
const app = express();
// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));
const port = process.env.PORT || 5000;
app.listen(port, () => __awaiter(this, void 0, void 0, function* () {
    console.log('Server running on port: ' + port);
    const res = yield WindyAPI.standard(49.809, 16.787, process.env.WINDY_API_KEY);
    console.log(res);
}));
//# sourceMappingURL=server.js.map