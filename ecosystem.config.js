module.exports = {
  apps: [
    {
      name: "riseflake-website",
      script: "server.js",
      cwd: "/home/ec2-user/website-riseflake",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      // Single fork instance, tight memory cap — this box is shared with three
      // other apps + Postgres + Redis and has very little headroom (see
      // deploy notes). `pm2 restart` (not `reload`) is used on deploy for the
      // same reason: cluster-style zero-downtime reload briefly runs old+new
      // processes together, which this host cannot safely absorb.
      max_memory_restart: "250M",
      env_file: "/home/ec2-user/website-riseflake/.env",
      env: {
        NODE_ENV: "production",
        PORT: 3300,
        HOSTNAME: "127.0.0.1",
      },
      error_file: "/home/ec2-user/logs/riseflake-website-error.log",
      out_file: "/home/ec2-user/logs/riseflake-website-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
