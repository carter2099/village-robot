/**
 * Get a random element from any Array
 * @param array - The Array to pick from
 * @returns a random element from the Array
 */
export const randomPick = (array: any[]): any => {
  const choice = Math.floor(Math.random() * array.length);
  return array[choice];
};

/**
 * Build a graph from an array of dash-separated vertices. Each entry in the array represents an edge.
 * The resulting map will contain keys representing each vertex, with their respective values being adjacent vertices.
 * @param edges - Array of dash-separated vertices indicating an edge in the graph
 * @returns A Map describing the resulting graph
 */
export const buildGraph = (edges: string[]): Map<string, string> => {
  let graph: Map<string, string> = new Map();
  // Create the vertex and add the edge else add the edge to the existing vertex
  const addEdge = (from: string, to: string) => {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  };
  // Parce the list of dash seperated vertices into a graph
  edges
    .map((r) => r.split("-"))
    .forEach(([from, to]) => {
      addEdge(from, to);
      addEdge(to, from);
    });

  return graph;
};

/**
 * Find a sequence of edges that take you from 'from' to 'to'
 * @param graph - The graph to traverse
 * @param from - The current vertex
 * @param to - The destination vertex
 * @returns The path; an ordered array of vertices
 */
export const findRoute = (
  graph: Map<string, string>,
  from: string,
  to: string
): string[] => {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) {
        return route.concat(place);
      }
      if (!work.some((w) => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
};
