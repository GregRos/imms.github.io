/* */ 
"format cjs";
/*
 *  /MathJax/jax/element/mml/optable/MathOperators.js
 *
 *  Copyright (c) 2009-2015 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function(a){var c=a.mo.OPTYPES;var b=a.TEXCLASS;MathJax.Hub.Insert(a.mo.prototype,{OPTABLE:{prefix:{"\u2204":c.ORD21,"\u221B":c.ORD11,"\u221C":c.ORD11,"\u2221":c.ORD,"\u2222":c.ORD,"\u222C":c.INTEGRAL,"\u222D":c.INTEGRAL,"\u222F":c.INTEGRAL,"\u2230":c.INTEGRAL,"\u2231":c.INTEGRAL,"\u2232":c.INTEGRAL,"\u2233":c.INTEGRAL},infix:{"\u2201":[1,2,b.ORD],"\u2206":c.BIN3,"\u220A":c.REL,"\u220C":c.REL,"\u220D":c.REL,"\u220E":c.BIN3,"\u2214":c.BIN4,"\u221F":c.REL,"\u2224":c.REL,"\u2226":c.REL,"\u2234":c.REL,"\u2235":c.REL,"\u2236":c.REL,"\u2237":c.REL,"\u2238":c.BIN4,"\u2239":c.REL,"\u223A":c.BIN4,"\u223B":c.REL,"\u223D":c.REL,"\u223D\u0331":c.BIN3,"\u223E":c.REL,"\u223F":c.BIN3,"\u2241":c.REL,"\u2242":c.REL,"\u2242\u0338":c.REL,"\u2244":c.REL,"\u2246":c.REL,"\u2247":c.REL,"\u2249":c.REL,"\u224A":c.REL,"\u224B":c.REL,"\u224C":c.REL,"\u224E":c.REL,"\u224E\u0338":c.REL,"\u224F":c.REL,"\u224F\u0338":c.REL,"\u2251":c.REL,"\u2252":c.REL,"\u2253":c.REL,"\u2254":c.REL,"\u2255":c.REL,"\u2256":c.REL,"\u2257":c.REL,"\u2258":c.REL,"\u2259":c.REL,"\u225A":c.REL,"\u225C":c.REL,"\u225D":c.REL,"\u225E":c.REL,"\u225F":c.REL,"\u2262":c.REL,"\u2263":c.REL,"\u2266":c.REL,"\u2266\u0338":c.REL,"\u2267":c.REL,"\u2268":c.REL,"\u2269":c.REL,"\u226A\u0338":c.REL,"\u226B\u0338":c.REL,"\u226C":c.REL,"\u226D":c.REL,"\u226E":c.REL,"\u226F":c.REL,"\u2270":c.REL,"\u2271":c.REL,"\u2272":c.REL,"\u2273":c.REL,"\u2274":c.REL,"\u2275":c.REL,"\u2276":c.REL,"\u2277":c.REL,"\u2278":c.REL,"\u2279":c.REL,"\u227C":c.REL,"\u227D":c.REL,"\u227E":c.REL,"\u227F":c.REL,"\u227F\u0338":c.REL,"\u2280":c.REL,"\u2281":c.REL,"\u2282\u20D2":c.REL,"\u2283\u20D2":c.REL,"\u2284":c.REL,"\u2285":c.REL,"\u2288":c.REL,"\u2289":c.REL,"\u228A":c.REL,"\u228B":c.REL,"\u228C":c.BIN4,"\u228D":c.BIN4,"\u228F":c.REL,"\u228F\u0338":c.REL,"\u2290":c.REL,"\u2290\u0338":c.REL,"\u229A":c.BIN4,"\u229B":c.BIN4,"\u229C":c.BIN4,"\u229D":c.BIN4,"\u229E":c.BIN4,"\u229F":c.BIN4,"\u22A0":c.BIN4,"\u22A1":c.BIN4,"\u22A6":c.REL,"\u22A7":c.REL,"\u22A9":c.REL,"\u22AA":c.REL,"\u22AB":c.REL,"\u22AC":c.REL,"\u22AD":c.REL,"\u22AE":c.REL,"\u22AF":c.REL,"\u22B0":c.REL,"\u22B1":c.REL,"\u22B2":c.REL,"\u22B3":c.REL,"\u22B4":c.REL,"\u22B5":c.REL,"\u22B6":c.REL,"\u22B7":c.REL,"\u22B8":c.REL,"\u22B9":c.REL,"\u22BA":c.BIN4,"\u22BB":c.BIN4,"\u22BC":c.BIN4,"\u22BD":c.BIN4,"\u22BE":c.BIN3,"\u22BF":c.BIN3,"\u22C7":c.BIN4,"\u22C9":c.BIN4,"\u22CA":c.BIN4,"\u22CB":c.BIN4,"\u22CC":c.BIN4,"\u22CD":c.REL,"\u22CE":c.BIN4,"\u22CF":c.BIN4,"\u22D0":c.REL,"\u22D1":c.REL,"\u22D2":c.BIN4,"\u22D3":c.BIN4,"\u22D4":c.REL,"\u22D5":c.REL,"\u22D6":c.REL,"\u22D7":c.REL,"\u22D8":c.REL,"\u22D9":c.REL,"\u22DA":c.REL,"\u22DB":c.REL,"\u22DC":c.REL,"\u22DD":c.REL,"\u22DE":c.REL,"\u22DF":c.REL,"\u22E0":c.REL,"\u22E1":c.REL,"\u22E2":c.REL,"\u22E3":c.REL,"\u22E4":c.REL,"\u22E5":c.REL,"\u22E6":c.REL,"\u22E7":c.REL,"\u22E8":c.REL,"\u22E9":c.REL,"\u22EA":c.REL,"\u22EB":c.REL,"\u22EC":c.REL,"\u22ED":c.REL,"\u22F0":c.REL,"\u22F2":c.REL,"\u22F3":c.REL,"\u22F4":c.REL,"\u22F5":c.REL,"\u22F6":c.REL,"\u22F7":c.REL,"\u22F8":c.REL,"\u22F9":c.REL,"\u22FA":c.REL,"\u22FB":c.REL,"\u22FC":c.REL,"\u22FD":c.REL,"\u22FE":c.REL,"\u22FF":c.REL}}});MathJax.Ajax.loadComplete(a.optableDir+"/MathOperators.js")})(MathJax.ElementJax.mml);
