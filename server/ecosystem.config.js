module.exports = {
    apps: [
      {
        name: 'wallet-app',
        script: 'dist/server.js',
        instances: 'max', 
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env_development: {
          NODE_ENV: 'development',
          PORT: 5000
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 5000
        },
        error_file: 'logs/err.log',
        out_file: 'logs/out.log',
        log_file: 'logs/combined.log',
        time: true
      }
    ]
  };