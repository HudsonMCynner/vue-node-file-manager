import { getColumns, getValues, getValuesUpdate } from '../../../../src/app/crud/repository/helper.js'
import assert from 'assert'

const testHelperCrud = function () {
	describe('src/app/crud/repository/helper', function () {
		const obj = {
			id: 0,
			nome: 'nome teste',
			email: 'email teste',
			senha: 'senha teste'
		}
		it('method should return columns in one string', function () {
			const columns = getColumns(obj)
			if (columns === 'nome, email, senha') {
				assert.ok(true)
			}
			else {
				assert.ok(false)
			}
		})

		it('method should return the values in one string', function () {
			const values = getValues(obj)
			if (values === 'nome teste, email teste, senha teste') {
				assert.ok(true)
			}
			else {
				assert.ok(false)
			}
		})

		it('method should return the values in format of update in one string', function () {
			const values = getValuesUpdate(obj)
			if (values === 'nome = nome teste, email = email teste, senha = senha teste') {
				assert.ok(true)
			}
			else {
				assert.ok(false)
			}
		})
	})
}

export {
	testHelperCrud
}
