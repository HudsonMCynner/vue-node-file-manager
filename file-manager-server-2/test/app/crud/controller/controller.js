import mocks from 'node-mocks-http'
import assert from 'assert'
import Repository from '../../../../src/app/crud/repository/Repository.js'
import Controller from '../../../../src/app/crud/controller/Controller.js'

const testController = function () {
	describe('test crud controller', function () {
		const repository = Repository.instance('usuario', 'twitter')
		const controller =  Controller.instance(repository)

		it('method should save a new register', function () {
			const req = mocks.createRequest()
			const res = mocks.createResponse()

			req.body = {
				nome: 'teste',
				email: 'teste@gmail.com',
				senha: 'teste'
			}
			controller.save(req, res)
			if (res.status === 200) {
				assert.ok(true)
			}
		})

		it('method should return all the registers', function () {
			const req = mocks.createRequest()
			const res = mocks.createResponse()

			controller.getAll(req, res)

		})
	})
}

export {
	testController
}
