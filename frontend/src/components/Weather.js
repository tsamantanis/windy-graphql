import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from '../index'

function Weather() {
    const [lat, setLat] = useState(47.7)
    const [lon, setLon] = useState(53.3)
    const [time, setTime] = useState("E M f, Y")
    const [temp, setTemp] = useState("C")
    const [wind, setWind] = useState("kts")
    const [humanized, setHumanized] = useState(true)
    const [ weather, setWeather ] = useState(null)

    async function onSubmit(e) {
        e.preventDefault();
        if (humanized) await getHumanizedWeather()
        else await getWeather()
    }

    async function getWeather() {
        try {
            const json = await client.query({
                query: gql`
                    query {
                        getWeather(lat:${ lat }, lon:${ lon }) {
                            ts
                            units {
                                tempSurface
                                winduSurface
                                windvSurface
                                rhSurface
                            }
                            tempSurface
                            winduSurface
                            windvSurface
                            rhSurface
                        }
                    }
                `
            })
            setWeather(json)
        } catch(err) {
            console.log(err.message)
        }
    }

    async function getHumanizedWeather() {
        try {
            const json = await client.query({
                query: gql`
                    query {
                        getHumanizedWeather(lat:${ lat }, lon:${ lon }, time:${ formatGraphQLStringParam(time) }, temp:${ formatGraphQLStringParam(temp) }, wind:${ formatGraphQLStringParam(wind) }) {
                            humanizedTime
                            humanizedTempSurface
                            humanizedWinduSurface
                            humanizedWindvSurface
                            humanizedRhSurface
                        }
                    }
                `
            })
            setWeather(json)
        } catch(err) {
            console.log(err.message)
        }
    }

    function formatGraphQLStringParam(str) {
        return "\"" + str + "\""
    }

    return (
        <div className="Weather">
            <form onSubmit={ onSubmit }>
                <div className="input-item">
                    <label>Latitude</label>
                    <input
                        type="decimal"
                        value={ lat }
                        onChange={(e) => setLat(e.target.value)}
                        required
                    />
                </div>
                <div className="input-item">
                    <label>Longitude</label>
                    <input
                        type="decimal"
                        value={ lon }
                        onChange={(e) => setLon(e.target.value)}
                        required
                    />
                </div>
                <div className="input-item">
                    <label>Time Format</label>
                    <input
                        placeholder="E M f, Y"
                        type="text"
                        value={ time }
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <div className="input-item">
                    <label>Temperature Units</label>
                    <select
                        type="text"
                        value={ temp }
                        onChange={(e) => setTemp(e.target.value)}
                        required
                    >
                        <option value="C">C</option>
                        <option value="F">F</option>
                        <option value="K">K</option>
                    </select>
                </div>
                <div className="input-item">
                    <label>Wind Units</label>
                    <select
                        type="text"
                        value={ wind }
                        onChange={(e) => setWind(e.target.value)}
                        required
                    >
                        <option value="kts">Knots</option>
                        <option value="mph">Miles per hour</option>
                        <option value="bft">Beaufort</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="results">
                { weather ?
                      humanized ?
                          <>
                              <h1>Date: { weather.data.getHumanizedWeather.humanizedTime[0] }</h1>
                              <h1>Temperature: { weather.data.getHumanizedWeather.humanizedTempSurface[0] } { temp }</h1>
                              <h1>Wind: { weather.data.getHumanizedWeather.humanizedWinduSurface[0] } { wind }</h1>
                          </>
                          :
                          <>
                              <h1>Date: { weather.data.getWeather.time[0] }</h1>
                              <h1>Temperature: { weather.data.getWeather.tempSurface[0] } { temp }</h1>
                              <h1>Wind: { weather.data.getWeather.winduSurface[0] } { wind }</h1>
                          </>
                      : null
                }
            </div>
        </div>
    );
}

export default Weather
