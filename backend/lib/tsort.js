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
  export function generateCS(){
    var csPrereqs = [
      ["MAC2311", "MAC2312"],
      ["MAC2312", "MAC2313"],
      ["MAC2311", "COP3503"],
      ["COP3502", "COP3503"],
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
      ["COP3503", "EEL3701"]
    ]

    var preReqs = tsort(csPrereqs);
    return preReqs;
  }
  //if major is CE
  export function generateCE(){
    var cePrereqs = [
      ["MAC2311", "MAC2312"],
      ["MAC2312", "MAC2313"],
      ["MAC2311", "MAP2302"],
      ["MAC2311", "COP3503"],
      ["COP3502", "COP3503"],
      ["COP4600", "CNT4007"],
      ["CHM2045", "CHM2046"],
      ["PHY2049", "EEL3111"],
      ["MAC2312", "EEL3135"],
      ["MAC2313", "EEL3111"],
      ["EEL3701", "EEL3744"],
      ["EEL3701", "EEL4712"],
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
      ["COP3503", "EEL3701"]
    ]

    var preReqs = tsort(cePrereqs);
    return preReqs;
  }


  //testing the top sort with numbers / letters
  function tsortTest() {
  
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
  }

function filterCourses(taken, preReqs){
  for (let i = 0; i < taken.length; i++){
    console.log(taken[i]);
    for (let j = 0; j < preReqs.length; j++){
      if (preReqs[j] == taken[i]){
        preReqs.splice(j,1);
        break;
      }
    }
  }

  var semesters = [];
  for (let i = 0; i < preReqs.length; i++){ //run through all necessary classes
    for (let j = 0; j < preReqs.length; j++){ //semester limit 4 classes
      //if (preReqs[i] )
    }
  }
  //need to put the part of the schedule generator where they split into semesters
  //need to make sure that physics 1 and 2 aren't in the same semester, etc.

  return preReqs;
}
