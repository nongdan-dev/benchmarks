// test_node/src/cli.ts
console.log("⏱️ Node CLI benchmark starting...");
const start = Date.now();

// Giả lập tác vụ CLI
setTimeout(() => {
  const duration = (Date.now() - start) / 1000;
  console.log(`✅ Node CLI benchmark done in ${duration}s`);
  process.exit(0);
}, 500); // giả lập 500ms công việc
