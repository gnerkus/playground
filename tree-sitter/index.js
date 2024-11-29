const Parser = require('tree-sitter');
const Javascript = require('tree-sitter-javascript');

(async function f() {
    const parser = new Parser();

    parser.setLanguage(Javascript);

    const tree = await parser.parse('let x = 1; console.log(x);');
    console.log(tree.rootNode.toString());
})()
