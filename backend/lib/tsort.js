/**
 * general topological sort
 * 
 * @param Array<Array> edges : list of edges. each edge forms Array<ID,ID> e.g. [12 , 3]
 *
 * @returns Array : topological sorted list of IDs
 **/

 export function tsort(edges) {
  var nodes   = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
      sorted  = [], // sorted list of IDs ( returned value )
      visited = {}; // hash: id of already visited node => true

  var Node = function(id) {
    this.id = id;
    this.afters = [];
  }

  // 1. build data structures
  edges.forEach(function(v) {
    var from = v[0], to = v[1];
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to]     = new Node(to);
    nodes[from].afters.push(to);
  });

  // 2. topological sort
  Object.keys(nodes).forEach(function visit(idstr, ancestors) {
    var node = nodes[idstr],
        id   = node.id;

    // if already exists, do nothing
    if (visited[idstr]) return;

    if (!Array.isArray(ancestors)) ancestors = [];

    ancestors.push(id);

    visited[idstr] = true;

    node.afters.forEach(function(afterID) {
      if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
        throw new Error('closed chain : ' +  afterID + ' is in ' + id);

      visit(afterID.toString(), ancestors.map(function(v) { return v })); // recursive call
    });

    sorted.unshift(id);
  });

  return sorted;
}

//if major is CS
export var csPrereqs = [
  ["CIS4914", "Graduate"],
  ["EGS4034", "Graduate"],
  ["COP4600", "CNT4007"],
  ["COP3530", "COP4600"],
  ["COP3503", "COP3530"],
  ["COP3530", "CEN3031"],
  ["MAC2312", "MAS3114"],
  ["MAC2311", "STA3032"],
  ["PHY2048", "PHY2049"],
  ["MAC2311", "COT3100"],
  ["COT3100", "COP3530"],
  ["MAC2312", "COP3530"],
  ["COP3503", "CDA3101"],
  ["COT3100", "CDA3101"],
  ["CDA3101", "COP4600"],
  ["COP3503", "CIS4301"],
  ["COT3100", "CIS4301"],
  ["COP3503", "EEL3701"],
  ["CHM2045", "CHM2046"],
  ["MAC2311", "MAC2312"],
  ["MAC2312", "MAC2313"],
  ["MAC2311", "COP3503"],
  ["COP3502", "COP3503"],
  ["COP3503", "COT4501"],
  ["start", "MAC2311"],
  ["start", "PHY2048"],
  ["start", "CHM2045"],
  ["start", "ENC3246"]
]
export function generateCS(csPrereqs){
  var preReqs = tsort(csPrereqs);
  preReqs = preReqs.splice(1,preReqs.length-2);
  return preReqs;
}


//if major is CE
export var cePrereqs = [
  ["JRDESIGN", "Graduate"],
  ["SRDESIGN", "Graduate"],
  ["JRDESIGN", "SRDESIGN"],
  ["CHM2045", "CHM2046"],
  ["PHY2049", "EEL3111"],
  ["MAC2312", "EEL3135"],
  ["MAC2313", "EEL3111"],
  ["EEL3701", "EEL3744"],
  ["EEL3701", "EEL4712"],
  ["COP3530", "COP4600"],
  ["CDA3101", "COP4600"],
  ["COP4600", "CNT4007"],
  ["COP3503", "COP3530"],
  ["COP3530", "CEN3031"],
  ["MAC2312", "MAS3114"],
  ["MAC2311", "STA3032"],
  ["PHY2048", "PHY2049"],
  ["MAC2311", "COT3100"],
  ["COT3100", "COP3530"],
  ["MAC2312", "COP3530"],
  ["COP3503", "CDA3101"],
  ["COT3100", "CDA3101"],
  ["COP3503", "EEL3701"],
  ["CHM2045", "CHM2046"],
  ["MAC2311", "MAC2312"],
  ["MAC2312", "MAC2313"],
  ["MAC2311", "MAP2302"],
  ["MAC2311", "COP3503"],
  ["COP3502", "COP3503"], 
  ["COP3503", "COT4501"],
  ["start", "MAC2311"],
  ["start", "PHY2048"],
  ["start", "CHM2045"],
  ["start", "ENC3246"]
]
export function generateCE(cePrereqs){
  var preReqs = tsort(cePrereqs);
  preReqs = preReqs.splice(1,preReqs.length-2);
  return preReqs;
}

export function filterCourses(taken, preReqs, major){
  outerloop: for (let i = 0; i < taken.length; i++){
    //console.log(taken[i]);
    for (let j = 0; j < preReqs.length; j++){
        if (preReqs[j] == taken[i]){
            preReqs.splice(j,1);
            continue outerloop;
        }
    }
  }
//need to put the part of the schedule generator where they split into semesters
  var semesters = [[], [], [], [], [], [], [], [], [], []];
  let j = 0;
  var techEs = 5, minors = 0, brEs = 0;

  if (major == "CPS_BSCS"){
      minors += 5;
  }
  if (major == "CPE_BSCE"){
      brEs += 2;
      techEs += 1;
  }
  coursesloop: for (let i = 0; i < preReqs.length; i++){ //run through all necessary classes
     //semester number we're on
     var numClasses = semesters[j].length;
    if (numClasses == 4){
        j++;
        //console.log("Moving to next semester");
        numClasses = 0;
    }    
    else if(numClasses == 0){ //if first class in semester
        semesters[j].push(preReqs[i])
        //console.log("ADDING ", preReqs[i]);
        continue coursesloop;
    }
//need to make sure that physics 1 and 2 aren't in the same semester, etc.    
    for (let k = 0; k < numClasses; k++){
      //console.log("Checking course ", k+1, " in semester ", j+1);
      for (let l = 0; l < cePrereqs.length; l++){
        if(cePrereqs[l][1] == preReqs[i] && semesters[j][k] == cePrereqs[l][0]){ //could be refined to see if prerequisite and not same prefix
            semesters[j+1].push(preReqs[i]);
            if(minors > 0){
                semesters[j].push("MINOR CLASS");
                minors--;
            }
            else if(brEs > 0){
                semesters[j].push("BREADTH ELECTIVE");
                brEs--;
            }
            else if(techEs > 0){
                semesters[j].push("TECH ELECTIVE");
                techEs--;
            }
            //console.log("ADDING ", preReqs[i], " TO NEXT SEMESTER");
            continue coursesloop;
        }
      }
    }
    //console.log("ADDING ", preReqs[i], numClasses, j);
    semesters[j].push(preReqs[i]);
  }
  if (minors > 0){
      for (let i = 0; i < minors; i++){
          if(semesters[j].length == 4){
              j++
          }
        semesters[j].push("MINOR CLASS");
      }
  }
  if (brEs > 0){
      for (let i = 0; i < brEs; i++){
          if(semesters[j].length == 4){
              j++
          }
        semesters[j].push("BREADTH ELECTIVE");
      }
  }
  if (techEs > 0){
      for (let i = 0; i < techEs; i++){
          if(semesters[j].length == 4){
              j++
          }
        semesters[j].push("TECHNICAL ELECTIVE");
        
      }
  }
  semesters = semesters.slice(0, j+1);
  return semesters;
}

function test(){
  var major = "CPS_BSCS";
  var taken = ["PHY2048", "MAC2311", "COP3502", "CHM2045"];
  console.log("Here's what you've taken", taken);
  var preReqs = generateCS(csPrereqs);
  console.log("Here's the required courses for your major: ", preReqs);
  var left = filterCourses(taken, preReqs, major);

  console.log("Here's what's left for you to do: ");
  for (let i = 0; i < left.length; i++){
      console.log("Semester ", i+1, ": ");
      for (let j = 0; j < left[i].length; j++){
          console.log(left[i][j]);
      }
  }
}

// for node.js
if (typeof exports == 'object' && exports === this) {
  module.exports = tsort;
  if (process.argv[1] === __filename) test();
}

//testing the top sort with numbers / letters
/*function tsortTest() {

  // example 1: success
  var courses = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 4]
  ];

  var sorted = tsort(courses);
  console.log(sorted);

  // example 2: failure ( A > B > C > A )
  edges = [
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'A']
  ];

  try {
    sorted = tsort(edges);
    console.log("Success! ", sorted);
  }
  catch (e) {
    console.log(e.message);
  }
}*/
