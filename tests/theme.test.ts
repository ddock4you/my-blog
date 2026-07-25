import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveDarkModePreference } from '../src/lib/theme.ts';

test('저장값 false는 시스템 다크모드보다 우선한다', () => {
  assert.equal(resolveDarkModePreference('false', true), false);
});

test('저장값 true는 다크모드를 적용한다', () => {
  assert.equal(resolveDarkModePreference('true', false), true);
});

test('저장값이 없으면 시스템 설정을 따른다', () => {
  assert.equal(resolveDarkModePreference(null, true), true);
  assert.equal(resolveDarkModePreference(null, false), false);
});
