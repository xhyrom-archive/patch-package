import test from 'ava'

import { runCommand } from '../index.js'

test('run_command from native', (t) => {
  t.is(runCommand('echo', process.cwd(), ['test']), 'test\n');
})
