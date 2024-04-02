require("dotenv").config()
const axios = require("axios")
import { Database } from "../src/util/database/Database"

let database: Database

describe("Exercise Tracker", () => {
  /** -------------------------------- Arrange ------------------------------------ **/
  beforeAll(async () => {
    database = await Database.getInstance()
  })
  beforeEach(async () => {
    await database.removeAllDocuments()
  })
  afterAll(async () => {
    await database.disconnect()
  })
  const baseUrl = `http://localhost:${process.env.PORT}/api/users`
  const baseUsername = "Brian ure"
  const userStructure = {
    username: expect.any(String),
    _id: expect.any(String)
  }

  test("You can POST to /api/users with form data username to create a new user.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username = `${baseUsername} - ${Date.now()}`

    /** ---------------------------------- Act -------------------------------------- **/
    const { data } = await axios.post(baseUrl, {
      username: username
    })
    const id = data._id
    const newUser = await database.findUserById(id)

    /** --------------------------------- Assert ------------------------------------- **/
    expect(newUser).toHaveProperty("username")
    expect(newUser).toHaveProperty("_id")
    expect(newUser['username']).toBe(username)
    expect(newUser['_id'].toString()).toBe(id)
  })

  test("The returned response from POST /api/users with form data username will be an object with username and _id properties.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username = `${baseUsername} - ${Date.now()}`

    /** ---------------------------------- Act -------------------------------------- **/
    const { data } = await axios.post(baseUrl, {
      username: username
    })

    /** --------------------------------- Assert ------------------------------------- **/
    expect(data).toHaveProperty("username")
    expect(data).toHaveProperty("count")
    expect(data).toHaveProperty("_id")
    expect(data.username).toBe(username)
    expect(data.count).toBe(0)
  })

  test("You can make a GET request to /api/users to get a list of all users.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username1 = `${baseUsername} 1 - ${Date.now()}`
    const username2 = `${baseUsername} 2 - ${Date.now()}`

    await axios.post(baseUrl, {
      username: username1
    })
    await axios.post(baseUrl, {
      username: username2
    })
    /** ---------------------------------- Act -------------------------------------- **/
    const { data } = await axios.get(baseUrl)


    /** --------------------------------- Assert ------------------------------------- **/
    expect(data).toEqual(expect.arrayContaining([expect.objectContaining(userStructure)]))
  })

  test("You can POST to /api/users/:_id/exercises with form data description, duration, and date.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username = `${baseUsername} - ${Date.now()}`
    const { data: { _id } } = await axios.post(baseUrl, {
      username: username
    })

    const url = `${baseUrl}/${_id}/exercises`
    const requestData = {
      description: `Test exercise description`,
      duration: 60,
      date: new Date("1993-08-29").toDateString()
    }
    const { data } = await axios.post(url, requestData)

    /** ---------------------------------- Act -------------------------------------- **/

    /** --------------------------------- Assert ------------------------------------- **/
    console.log(data)
    expect(data).toHaveProperty("username")
    expect(data).toHaveProperty("description")
    expect(data).toHaveProperty("duration")
    expect(data).toHaveProperty("date")
    expect(data.username).toBe(username)
    expect(data.description).toBe(requestData.description)
    expect(data.duration).toBe(requestData.duration)
    expect(data.date).toBe(new Date(requestData.date).toDateString())
  })

  test("You can POST to /api/users/:_id/exercises with form data description, duration, and no date, and the return object will have a date.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username = `${baseUsername} - ${Date.now()}`
    const { data: { _id } } = await axios.post(baseUrl, {
      username: username
    })

    const url = `${baseUrl}/${_id}/exercises`
    const requestData = {
      description: `Test exercise description`,
      duration: 60,
    }

    /** ---------------------------------- Act -------------------------------------- **/
    const { data } = await axios.post(url, requestData)
    

    /** --------------------------------- Assert ------------------------------------- **/
    expect(data).toHaveProperty("username")
    expect(data).toHaveProperty("_id")
    expect(data).toHaveProperty("description")
    expect(data).toHaveProperty("duration")
    expect(data).toHaveProperty("date")
    expect(data.description).toBe(requestData.description)
    expect(data._id).toBe(_id)
    expect(data.duration).toBe(requestData.duration)
    expect(data.date).toBe(new Date().toDateString())
  })

  test("You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username = `${baseUsername} - ${Date.now()}`
    const { data: { _id } } = await axios.post(baseUrl, {
      username: username
    })

    console.log("id", _id)

    const exerciseUrl = `${baseUrl}/${_id}/exercises`
    const requestData = {
      description: `Test exercise description`,
      duration: 60,
      date: new Date().toDateString()
    }
    await axios.post(exerciseUrl, requestData)

    const logsUrl = `${baseUrl}/${_id}/logs`

    /** ---------------------------------- Act -------------------------------------- **/
    const { data } = await axios.get(logsUrl)

    /** --------------------------------- Assert ------------------------------------- **/
    expect(data).toHaveProperty("username")
    expect(data).toHaveProperty("count")
    expect(data).toHaveProperty("log")
    expect(data.username).toBe(username)
    expect(data.log).toHaveLength(1)
    expect(data.count).toBe(1)
  })

  test("Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username = `${baseUsername} - ${Date.now()}`
    const { data: { _id } } = await axios.post(baseUrl, {
      username: username
    })

    const exerciseUrl = `${baseUrl}/${_id}/exercises`
    const requestData = {
      description: `Test exercise description`,
      duration: 60,
      date: new Date().toDateString()
    }
    await axios.post(exerciseUrl, requestData)

    const logsUrl = `${baseUrl}/${_id}/logs`

    /** ---------------------------------- Act -------------------------------------- **/
    const { data: { log } } = await axios.get(logsUrl)
    const firstLog = log[0]
    const { description, duration, date } = firstLog

    /** --------------------------------- Assert ------------------------------------- **/
    expect(log).toBeInstanceOf(Array)
    expect(log).toHaveLength(1)
    expect(firstLog).toHaveProperty("description")
    expect(firstLog).toHaveProperty("duration")
    expect(firstLog).toHaveProperty("date")
    expect(typeof description).toBe("string")
    expect(typeof duration).toBe("number")
    expect(typeof date).toBe("string")
    expect(description).toBe(requestData.description)
    expect(duration).toBe(requestData.duration)
    expect(date).toBe(requestData.date)
  })

  test("You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.", async () => {
    /** -------------------------------- Arrange ------------------------------------ **/
    const username = `${baseUsername} - ${Date.now()}`
    const { data: { _id } } = await axios.post(baseUrl, {
      username: username
    })

    const exerciseDate1 = "2021-01-01"
    const exerciseDate2 = "2022-01-01"
    const exerciseDate3 = "2023-01-01"
    const exerciseDate4 = "2024-01-01"

    const fromDate = "2021-06-01"
    const toDate = "2023-06-01"
    const limit = 1

    const exerciseUrl = `${baseUrl}/${_id}/exercises`
    const requestData1 = {
      description: `Test exercise description`,
      duration: 10,
      date: new Date(exerciseDate1).toDateString()
    }
    const requestData2 = {
      description: `Test exercise description`,
      duration: 20,
      date: new Date(exerciseDate2).toDateString()
    }
    const requestData3 = {
      description: `Test exercise description`,
      duration: 30,
      date: new Date(exerciseDate3).toDateString()
    }
    const requestData4 = {
      description: `Test exercise description`,
      duration: 40,
      date: new Date(exerciseDate4).toDateString()
    }
    await axios.post(exerciseUrl, requestData1)
    await axios.post(exerciseUrl, requestData2)
    await axios.post(exerciseUrl, requestData3)
    await axios.post(exerciseUrl, requestData4)

    const logsUrl1 = `${baseUrl}/${_id}/logs`
    const logsUrl2 = `${baseUrl}/${_id}/logs?from=${fromDate}`
    const logsUrl3 = `${baseUrl}/${_id}/logs?to=${toDate}`
    const logsUrl4 = `${baseUrl}/${_id}/logs?limit=${limit}`
    const logsUrl5 = `${baseUrl}/${_id}/logs?from=${fromDate}&to=${toDate}`
    const logsUrl6 = `${baseUrl}/${_id}/logs?from=${fromDate}&to=${toDate}&limit=${limit}`
    
    /** ---------------------------------- Act -------------------------------------- **/
    const { data: { log: log1 } } = await axios.get(logsUrl1)
    const { data: { log: log2 } } = await axios.get(logsUrl2)
    const { data: { log: log3 } } = await axios.get(logsUrl3)
    const { data: { log: log4 } } = await axios.get(logsUrl4)
    const { data: { log: log5 } } = await axios.get(logsUrl5)
    const { data: { log: log6 } } = await axios.get(logsUrl6)
    
    /** --------------------------------- Assert ------------------------------------- **/
    expect(log1).toBeInstanceOf(Array)
    expect(log1).toHaveLength(4)
    expect(log1[0].date).toBe(new Date(exerciseDate1).toDateString())
    expect(log1[3].date).toBe(new Date(exerciseDate4).toDateString())

    expect(log2).toBeInstanceOf(Array)
    expect(log2).toHaveLength(3)
    expect(log2[0].date).toBe(new Date(exerciseDate2).toDateString())
    expect(log2[2].date).toBe(new Date(exerciseDate4).toDateString())

    expect(log3).toBeInstanceOf(Array)
    expect(log3).toHaveLength(3)
    expect(log3[0].date).toBe(new Date(exerciseDate1).toDateString())
    expect(log3[2].date).toBe(new Date(exerciseDate3).toDateString())

    expect(log4).toBeInstanceOf(Array)
    expect(log4).toHaveLength(1)
    expect(log4[0].date).toBe(new Date(exerciseDate1).toDateString())

    expect(log5).toBeInstanceOf(Array)
    expect(log5).toHaveLength(2)
    expect(log5[0].date).toBe(new Date(exerciseDate2).toDateString())
    expect(log5[1].date).toBe(new Date(exerciseDate3).toDateString())

    expect(log6).toBeInstanceOf(Array)
    expect(log6).toHaveLength(1)
    expect(log6[0].date).toBe(new Date(exerciseDate2).toDateString())

  })
})