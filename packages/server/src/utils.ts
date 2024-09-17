export function convertOpenapiPathToTrekRouterPath(path: string): string {
  return path.replace(/{/g, ':').replace(/}/g, '')
}
