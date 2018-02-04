"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ti = require("./type_inference");
var type_parser_1 = require("./type-parser");
var cat_parser_1 = require("./cat-parser");
var cat_library_1 = require("./cat-library");
exports.verbose = true;
// The types of the core Cat 
exports.catTypes = {
    apply: "((('a -> 'b) 'a) -> 'b)",
    compose: "((('b -> 'c) (('a -> 'b) 'd)) -> (('a -> 'c) 'd))",
    quote: "(('a 'b) -> (('c -> ('a 'c)) 'b))",
    dup: "(('a 'b) -> ('a ('a 'b)))",
    swap: "(('a ('b 'c)) -> ('b ('a 'c)))",
    pop: "(('a 'b) -> 'b)",
    id: "('a -> 'a)",
};
exports.catTypesParsed = {};
// Parse the types
for (var k in exports.catTypes) {
    var t = type_parser_1.parseType(exports.catTypes[k]);
    if (exports.verbose)
        console.log(k + " : " + t);
    exports.catTypesParsed[k] = t;
}
// Compute the standard op types
for (var op in cat_library_1.catStdOps) {
    var def = cat_library_1.catStdOps[op];
    var t = inferCatType(def);
    if (exports.verbose)
        console.log(op + " = " + def + " : " + t);
    exports.catTypesParsed[op] = t;
}
function catTypeFromAst(ast) {
    switch (ast.name) {
        case "integer":
            return ti.quotation(ti.typeConstant('Num'));
        case "true":
        case "false":
            return ti.quotation(ti.typeConstant('Bool'));
        case "identifier": {
            if (!(ast.allText in exports.catTypesParsed))
                throw new Error("Could not find type for term: " + ast.allText);
            return exports.catTypesParsed[ast.allText];
        }
        case "quotation": {
            var innerType = ast.children.length > 0
                ? catTypeFromAst(ast.children[0])
                : ti.idFunction();
            return ti.quotation(innerType);
        }
        case "terms": {
            var types = ast.children.map(catTypeFromAst);
            return ti.composeFunctionChain(types);
        }
        default:
            throw new Error("Could not figure out function type");
    }
}
function inferCatType(s) {
    var ast = cat_parser_1.catParser(s);
    if (ast.allText.length != s.length)
        throw new Error("Could not parse the entire term: " + s);
    return catTypeFromAst(ast);
}
exports.inferCatType = inferCatType;
//# sourceMappingURL=cat-types.js.map