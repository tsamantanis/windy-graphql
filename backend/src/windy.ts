// https://api.windy.com/api/point-forecast/v2
const fetch = require("node-fetch");
const BetterDate = require("@tsamantanis/date-lib")
// params

export async function get<T>(
    lat: number, //  latitude
    lon: number, // longitude
    model: string, // forecast model ['Arome', 'IconEu', 'GFS', 'Wavewatch', 'namConus', 'namHawaii', 'namAlaska', 'geos5']
    parameters: Array<string>, // https://api.windy.com/point-forecast/docs#parameters
    levels: Array<string>, // geopotential values ['surface', '1000h', '950h', '925h', '900h', '850h', '800h', '700h', '600h', '500h', '400h', '300h', '200h', '150h']
    apiKey: string
) {
    try {
        const path = "https://api.windy.com/api/point-forecast/v2"
        const options = {
            method: "post",
            body: JSON.stringify({
                lat: lat,
                lon: lon,
                model: model,
                parameters: parameters,
                levels: levels,
                key: apiKey
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        const data = await fetch(path, options)
        return data.json()
    } catch (err) {
        return err;
    }
};

// default forecasting route
export async function standard<T>(
    lat: number, //  latitude
    lon: number, // longitude
    apiKey: string
) {
    try {
        const data = await get(
            lat,
            lon,
            "gfs",
            ["temp", "wind", "rh"],
            ["surface"],
            apiKey
        )
        return data
    } catch(error) {
        return error
    }
}

export async function beautify<T>(
    data: any,
    time = 'M D Y', // Better date .format() parameter
    temp = 'K', // temp units ['K', 'C', 'F']
    wind = 'm/s' // wind speed units ['m/s', 'kts', 'bft']
) {
    try {
        // dates
        data.ts = data.ts.map((ts) => new BetterDate(ts).format(time))
        // temp
        if (temp.toUpperCase() === 'C') data['temp-surface'] = data['temp-surface'].map((temp) => (temp - 273.15).toFixed(2))
        else if (temp.toUpperCase() === 'F') data['temp-surface'] = data['temp-surface'].map((temp) => ((temp - 273.15) * 1.8 + 32).toFixed(2))
        else data['temp-surface'] = data['temp-surface'].map((temp) => temp.toFixed(2))
        // wind
        if (wind.toLowerCase() === 'kts') {
            // convert to knots
            data['wind_u-surface'] = data['wind_u-surface'].map((wind) => (wind * 1.9438444924406).toFixed(0))
            data['wind_v-surface'] = data['wind_v-surface'].map((wind) => (wind * 1.9438444924406).toFixed(0))
        }
        if (wind.toLowerCase() === 'bft') {
            // convert to beaufort
            data['wind_u-surface'] = data['wind_u-surface'].map((wind) => mpsToBft(wind))
            data['wind_v-surface'] = data['wind_v-surface'].map((wind) => mpsToBft(wind))
        }
        // humidity
        data['rh-surface'] = data['rh-surface'].map((rh) => parseInt(rh).toString() + '%')

        return data
    } catch (error) {

    }
}

function mpsToBft(mps: number): number {
    let res = 0;
    if (Math.abs(mps) < 0.3) res = 0
    else if (Math.abs(mps) < 1.5) res = 1
    else if (Math.abs(mps) < 3.3) res = 2
    else if (Math.abs(mps) < 5.5) res = 3
    else if (Math.abs(mps) < 8.0) res = 4
    else if (Math.abs(mps) < 10.8) res = 5
    else if (Math.abs(mps) < 13.9) res = 6
    else if (Math.abs(mps) < 17.2) res = 7
    else if (Math.abs(mps) < 20.7) res = 8
    else if (Math.abs(mps) < 24.5) res = 9
    else if (Math.abs(mps) < 28.4) res = 10
    else if (Math.abs(mps) < 32.6) res = 11
    else res = 12
    return mps < 0 ? 0 - res : res
}
