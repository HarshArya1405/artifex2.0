const postViewed = async (params) => {
	
	try {
		let responseData = {
			currentDateTime: new Date().getTime()
		}
		return responseData

	} catch (error) {
		console.log(`[StatsServiceV2] postViewed service error `, error)
		let responseData = {
			currentDateTime: new Date().getTime(),
			serviceError: error
		}
		return responseData
	}
}

module.exports = {
	postViewed
}