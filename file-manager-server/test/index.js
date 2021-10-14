import config from './config'
import app from './app'

const tests = {
	...config,
	...app
}

Object.keys(tests).forEach((test) => {
	tests[test]()
})
