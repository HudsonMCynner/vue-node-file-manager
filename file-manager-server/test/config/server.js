import Server from '../../src/config/Server.js'
import assert from 'assert'

/**
 */
const startDev = function () {
	describe('src/config/Server', function() {
		const server = new Server()
		server.startServer()

		it('Object must be the attribute app', function() {
			if (server.app) {
				assert.ok(true)
			}
			else {
				assert.ok(false)
			}
		})

		it('Object must return the attribute app', function() {
			const app = server.getApp()
			if (app) {
				assert.ok(true)
			}
			else {
				assert.ok(false)
			}
		})
	})
}

export {
	startDev
}
