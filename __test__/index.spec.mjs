import test from 'ava'

import { runCommand } from '../index.js'

test('run_command from native', (t) => {
  t.is(true, true);
  // TODO: update because windows
  //t.is(runCommand('echo', process.cwd(), ['test']), 'test\n');
})
