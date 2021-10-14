import poolDatabase from '../../src/config/database.js'
import assert from 'assert'

/**
 */
const testConnection = function () {
	describe('src/config/poolDatabase', function() {
		it('Query must return anything', function() {
			poolDatabase.query('SELECT * twitter.usuario', [])
				.then((result) => {
					if (result.rows) {
						assert.ok(true)
					}
					else {
						assert.ok(false)
					}
				})
		})
	})
}

export {
	testConnection
}
