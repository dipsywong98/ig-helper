const esbuild = require('esbuild');

const githash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()

const main = async () => {
  const ctx = await esbuild.context({
    entryPoints: ['./src/server'],
    outfile: './dist/index.js',
    bundle: true,
    minify: false,
    platform: 'node',
    sourcemap: true,
    target: 'node16',
    plugins: [],
    define: {
      'process.env.githash': `'${githash}'`
    }
  });
  if (process.env.NODE_ENV === 'development') {
    console.log('watching')
    await ctx.watch()
  } else {
    console.log('rebuilding')
    await ctx.rebuild()
    await ctx.dispose()
    console.log('rebuilt')
  }
}

main()