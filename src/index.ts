import type { IndexHtmlTransformResult, Plugin } from 'vite'
import childProcess from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

interface RewriteOptions {
  name: string
  version: string
  shortHash: string
  fullHash: string
}

function execCommand(command: string): Promise<string> {
  const { exec } = childProcess

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error)
      }
      else {
        const output = stdout.toString()?.replace('\n', '')
        resolve(output)
      }
    })
  })
}

function readPackageInfo(): { name: string, version: string } {
  const packageJSONPath = resolve(process.cwd(), 'package.json')

  if (!existsSync(packageJSONPath)) {
    throw new Error(`package.json not found at ${packageJSONPath}`)
  }

  const packageJSON = JSON.parse(readFileSync(packageJSONPath, 'utf-8')) as { name: string, version: string }

  return packageJSON
}

async function getRewriteOptions(): Promise<RewriteOptions> {
  const { name, version } = readPackageInfo()
  const { shortHash, fullHash } = await readGitInfo()

  return {
    name,
    version,
    shortHash,
    fullHash,
  }
}

async function readGitInfo(): Promise<{ shortHash: string, fullHash: string }> {
  const shortHash = await execCommand('git rev-parse --short HEAD')
  const fullHash = await execCommand('git rev-parse HEAD')

  return {
    shortHash,
    fullHash,
  }
}

interface Options {
  /**
   * The global name of the version stamp.
   * @default '__VERSION__'
   */
  globalName?: string
  /**
   * The rewrite function to transform the version stamp.
   * @default { RewriteOptions }
   */
  version?: ((options: RewriteOptions) => unknown) | unknown

  /**
   * The output filename.
   * @default 'version.json'
   */
  filename?: string | false
}

export default (options: Options = {}): Plugin => {
  const { globalName = '__VERSION__', version, filename = 'version.json' } = options
  let outputDir: string | undefined
  let result: unknown

  const getVersionsResult = async (): Promise<unknown> => {
    if (result)
      return result

    const rewriteOptions = await getRewriteOptions()

    result = typeof version === 'function' ? version(rewriteOptions) : rewriteOptions

    return result
  }

  return {
    name: 'vite-plugin-version-stamp',
    async config() {
      const versionResult = await getVersionsResult()

      return {
        define: {
          [globalName]: versionResult,
        },
      }
    },

    async transformIndexHtml() {
      const versionResult = await getVersionsResult()

      const els: IndexHtmlTransformResult = []

      els.push({
        tag: 'script',
        injectTo: 'body',
        children: `${globalName} = ${JSON.stringify(versionResult)}`,
      })

      return els
    },
    configResolved(config) {
      outputDir = config.build.outDir
    },
    async closeBundle() {
      if (filename === false) {
        console.warn('vite-plugin-version-stamp: filename is false, skip writing file')
        return
      }

      if (!outputDir || !existsSync(outputDir)) {
        console.warn('vite-plugin-version-stamp: outputDir is not found, skip writing file')
        return
      }

      const targetFilepath = resolve(outputDir, filename)
      const versionResult = await getVersionsResult()

      writeFileSync(targetFilepath, JSON.stringify(versionResult, null, 2))
    },
  }
}
