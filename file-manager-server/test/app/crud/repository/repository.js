import Repository from '../../../../src/app/crud/repository/Repository.js'
import assert from 'assert'

const testCrudService = function () {
	describe('src/app/crud/repository/service', function () {
		const service = Repository.instance('usuario', 'twitter')

		it('method should realize any valid query', function () {
			service.query('SELECT * twitter.usuario', [])
				.then((result) => {
					if (result) {
						assert.ok(true)
					}
					else {
						assert.ok(false)
					}
				})
		})

		let id = 0
		it('method should insert one register', function () {
			const obj = {
				nome: 'teste',
				email: 'teste@gmail.com',
				senha: 'teste'
			}
			service.insert(obj)
				.then((result) => {
					if (result) {
						id = result.id
						assert.ok(true)
					}
					else {
						assert.ok(false)
					}
				})
		})

		it('method should return the register by id', function () {
			service.getById(id)
				.then((result) => {
					if (result) {
						assert.ok(true)
					}
					else {
						assert.ok(false)
					}
				})
		})

		it('method should return all the registers', function () {
			service.getAll()
				.then((result) => {
					if (result) {
						assert.ok(true)
					}
					else {
						assert.ok(false)
					}
				})
		})

		it('method should update the register', function () {
			const obj = {
				id: id,
				nome: 'teste alterado',
				email: 'teste@gmail.com',
				senha: 'teste alterado'
			}
			service.update(obj)
				.then((result) => {
					if (result) {
						assert.ok(true)
					}
					else {
						assert.ok(false)
					}
				})
		})

		it('method should delete the registers', function () {
			service.deleteById(id)
				.then((result) => {
					if (result) {
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
	testCrudService
}
