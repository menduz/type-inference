// This is a set of tests for the type-inference algorithm applied to lambda Calculus and the Concatenative calculus.
// Running these tests require installation of the Myna parsing module. 

import { TypeInference as ti } from "./type_inference";
import { parseType } from "./type-parser";

export const lambdaTests = [    
    ["(\\i.(i \\x.x) (i 0)) \\y.y", "Num"], // This cu\rrently fails: just like it does with HM
    ["0", "Num"],
    ["\\x.x", "!a.(a -> a)"],
    ["\\i.0", "!a.(a -> Num)"],
    ["\\i.i 0", "!a.((Num -> a) -> a)"],
    ["(\\i.0)", "!a.(a -> Num)"],
    ["(\\i.i 0)", "!a.((Num -> a) -> a)"],
    ["\\i.i (0)", "!a.((Num -> a) -> a)"],
    ["(\\i.0) \\y.y", "Num"],
    ["(\\i.0) (\\y.y)", "Num"],
    ["(\\i.i) \\y.y", "!a.(a -> a)"],
    ["(\\i.i) (\\y.y)", "!a.(a -> a)"],
    ["(\\i.i) (\\x.x) (\\y.y)","!a.(a -> a)"],
];

//==========================================================================================
// Testing helper functions 

export function testParse(input:string, fail:boolean=false) {
    runTest(() => parseType(input), input, fail);
}

export function runTest(f:() => any, testName:string, expectFail:boolean = false) {
    try {
        console.log("Running test: " + testName);
        var result = f();
        console.log("Result = " + result);
        if (result && !expectFail || !result && expectFail) {
            console.log("PASSED");
        }
        else {
            console.log("FAILED");
        }
    }   
    catch (e) {
        if (expectFail) {
            console.log("PASSED: expected fail, error caught: " + e.message);
        }
        else {
            console.log("FAILED: error caught: " + e.message);
        }
    }
}

export function typeToString(t:ti.Type) : string {
    if (t instanceof ti.TypeVariable) 
        return "'" + t.name;
    else if (t instanceof ti.TypeArray) 
        return "(" + t.types.map(typeToString).join(" ") + ")";
    else 
        return t.toString();
}

export function compareTypes(t1:ti.Type, t2:ti.Type) {
    {
        var r1 = ti.normalizeVarNames(t1).toString();
        var r2 = ti.normalizeVarNames(t2).toString();
        if (r1 != r2) {
            throw new Error("Types are not the same when normalized: " + r1 + " and " + r2);
        }
    }
    {
        var r1 = ti.alphabetizeVarNames(t1).toString();
        var r2 = ti.alphabetizeVarNames(t2).toString();
        if (r1 != r2) {
            throw new Error("Types are not the same when alphabetized: " + r1 + " and " + r2);
        }
    } 
}

/*
testCatTypes();
testLambdaCalculus();
testCombinators();
testCloning();
*/

// Passes in Cat!
//issue1InCat();

//issue1b();
//issue1();

//declare var process : any;
//process.exit();

