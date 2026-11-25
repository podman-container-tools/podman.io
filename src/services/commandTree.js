/** Flatten the command tree emitted by the Podman docs export. */
function flattenCommandTree(nodes, acc = []) {
  for (const node of nodes || []) {
    acc.push(node);
    if (node.subcommands && node.subcommands.length > 0) {
      flattenCommandTree(node.subcommands, acc);
    }
  }
  return acc;
}

module.exports = { flattenCommandTree };
