const dummyResponse = async (params) => {
	
	try {
		let responseData = {
			message:"this a test script from V1",
			currentDateTime: new Date().getTime()
		}
		return responseData

	} catch (error) {
		console.log(`[StatsServiceV2] dummyResponse service error `, error)
		let responseData = {
			currentDateTime: new Date().getTime(),
			serviceError: error
		}
		return responseData
	}
}

module.exports = {
	dummyResponse
}