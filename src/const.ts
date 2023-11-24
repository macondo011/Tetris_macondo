export const BLOCK_SIZE = 20
export const BOARD_WIDTH = 14
export const BOARD_HEIGHT = 28

export type PieceShape = 'square' | 'line' | 't-shape' | 'z-shape' | 'z-reverse-shape' | 'l-shape';


// 9. random pieces
export const PIECES:{
  id: PieceShape
  shape: number[][]
  color: string
}[] = 

[
    {
      id: 'square',
      shape:[
      [1, 1],
      [1, 1]
      ],
      color: 'red'
    },
    {
     id:'line',
     shape: [
      [1, 1, 1, 1]
    ],
    color: 'blue'
  },
  {
    id:'t-shape',
   shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'purple'
  },
  {
    id:'z-shape',
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'green'
  },
  {
    id:'l-shape',
    shape: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    color: 'yellow'
  },
  {
    id:'z-reverse-shape',
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'orange'
  }
  ]
  export const difficultyLevels: { scoreThreshold: number; fallSpeed: number }[] = 
  [
    { scoreThreshold: 0, fallSpeed: 1 }, 
    { scoreThreshold: 50, fallSpeed: 2 }, 
    { scoreThreshold: 150, fallSpeed: 6},
    { scoreThreshold: 200, fallSpeed: 8},
    { scoreThreshold: 250, fallSpeed: 10}, 
    // Agrega más niveles según sea necesario
  ];
  
 
  