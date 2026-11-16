// Development runner: Starts both backend and frontend concurrently
const { spawn } = require('child_process');
const path = require('path');

console.log('========================================================');
console.log('   Starting Local Resource Map MERN Stack Application   ');
console.log('========================================================\n');

// 1. Start Backend Server
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Dev Server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

// Handle termination signals
const cleanExit = () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
