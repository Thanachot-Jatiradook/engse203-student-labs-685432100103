const student = {
  name: "Thanachot Jatiradook",
  studentId: "68543210010-3",
  os: process.platform,
  node: process.version,
};

function createGreeting({ name, studentId, os, node }) {
  return `Hello ${name} (${studentId}) | OS: ${os} | Node: ${node}`;
}

console.log(createGreeting(student));