const assert = require('node:assert/strict')
const test = require('node:test')
const launcher = require('../pinokio')
const start = require('../start')

const menu = (files = [], running = [], local) => launcher.menu({}, {
  exists: file => files.includes(file),
  running: file => running.includes(file),
  local: () => local
})

test('partial installations offer Install, completed installations offer Start', async () => {
  assert.equal((await menu(['GLM-TTS/conda_env']))[0].href, 'install.js')
  assert.equal((await menu(['GLM-TTS/conda_env', 'GLM-TTS/.installed']))[0].href, 'start.js')
})

test('maintenance remains visible without installation files', async () => {
  for (const script of ['update', 'reset', 'link', 'install']) {
    const items = await menu([], [`${script}.js`])
    assert.equal(items.length, 1)
    assert.equal(items[0].href, `${script}.js`)
    assert.equal(items[0].default, true)
  }
  assert.equal((await menu([], ['update.js', 'install.js']))[0].href, 'update.js')
})

test('running server opens the captured URL, or its terminal while starting', async () => {
  const files = ['GLM-TTS/conda_env', 'GLM-TTS/.installed']
  assert.equal((await menu(files, ['start.js']))[0].href, 'start.js')
  assert.equal((await menu(files, ['start.js'], {url: 'http://127.0.0.1:7861'}))[0].href,
    'http://127.0.0.1:7861')
})

test('URL capture ignores unrelated links and captures the Gradio readiness message', () => {
  const event = start.run.find(step => step.method === 'shell.run').params.on[0].event
  const [, pattern, flags] = event.match(/^\/(.*)\/([a-z]*)$/)
  const regex = new RegExp(pattern, flags)
  assert.equal(regex.test('See http://example.com for help'), false)
  for (const host of ['127.0.0.1', 'localhost']) {
    const url = `http://${host}:7861`
    assert.equal(regex.exec(`* Running on local URL:  ${url}`)[1], url)
  }
})
