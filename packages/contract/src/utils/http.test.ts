import { expect, it } from 'vitest'
import { mergeHTTPPaths } from './http'

it('works', () => {
  expect(mergeHTTPPaths('/foo', '/bar')).toBe('/foo/bar')
  expect(mergeHTTPPaths('/foo', '/bar/')).toBe('/foo/bar')
  expect(mergeHTTPPaths('/foo/', '/bar')).toBe('/foo/bar')
  expect(mergeHTTPPaths('/foo/', '/bar/')).toBe('/foo/bar')
  expect(mergeHTTPPaths('/foo', '/bar/baz')).toBe('/foo/bar/baz')
  expect(mergeHTTPPaths('/foo/bar', '/baz')).toBe('/foo/bar/baz')
  expect(mergeHTTPPaths('/foo/bar/', '/baz')).toBe('/foo/bar/baz')
  expect(mergeHTTPPaths('/foo/bar', '/baz/')).toBe('/foo/bar/baz')
  expect(mergeHTTPPaths('/foo/bar/', '/baz/')).toBe('/foo/bar/baz')
  expect(mergeHTTPPaths('/foo/bar/baz', '/baz')).toBe('/foo/bar/baz/baz')
  expect(mergeHTTPPaths('/foo/bar/baz', '/baz/')).toBe('/foo/bar/baz/baz')
  expect(mergeHTTPPaths('/foo/bar/baz/', '/baz')).toBe('/foo/bar/baz/baz')
  expect(mergeHTTPPaths('/foo/bar/baz/', '/baz/')).toBe('/foo/bar/baz/baz')
})
