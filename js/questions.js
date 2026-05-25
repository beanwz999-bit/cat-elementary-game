// Questions Database for Cat Elementary Puzzle RPG
// Expanded pool for high replayability without repeats:
// - 10 questions per standard subject (Math, Reading, Science)
// - 12 questions per Final Test

export const QUESTIONS = {
  K: {
    title: "Kindergarten",
    math: [
      { text: "Count the fish swimming in the water!", options: ["2", "3", "4", "5"], correct: "3", visualType: "fish", visualData: { count: 3 } },
      { text: "How many fish are there now?", options: ["4", "5", "6", "7"], correct: "5", visualType: "fish", visualData: { count: 5 } },
      { text: "Count this school of fish!", options: ["6", "7", "8", "9"], correct: "7", visualType: "fish", visualData: { count: 7 } },
      { text: "How many fish are swimming here?", options: ["2", "3", "4", "5"], correct: "4", visualType: "fish", visualData: { count: 4 } },
      { text: "Let's count all these fish!", options: ["4", "5", "6", "7"], correct: "6", visualType: "fish", visualData: { count: 6 } },
      { text: "Count these little fish:", options: ["1", "2", "3", "4"], correct: "2", visualType: "fish", visualData: { count: 2 } },
      { text: "Look at the fish swimming! How many?", options: ["5", "6", "7", "8"], correct: "8", visualType: "fish", visualData: { count: 8 } },
      { text: "Count the cozy fish group:", options: ["1", "3", "5", "7"], correct: "1", visualType: "fish", visualData: { count: 1 } },
      { text: "How many fish swim in a row?", options: ["6", "7", "8", "9"], correct: "9", visualType: "fish", visualData: { count: 9 } },
      { text: "Count these colorful fish!", options: ["3", "4", "5", "6"], correct: "5", visualType: "fish", visualData: { count: 5 } }
    ],
    reading: [
      { text: "Which small letter matches the big letter 'A'?", options: ["b", "d", "a", "c"], correct: "a", visualType: "letters", visualData: { big: "A" } },
      { text: "Which small letter matches the big letter 'M'?", options: ["w", "n", "m", "u"], correct: "m", visualType: "letters", visualData: { big: "M" } },
      { text: "Which small letter matches the big letter 'S'?", options: ["z", "s", "c", "x"], correct: "s", visualType: "letters", visualData: { big: "S" } },
      { text: "Which small letter matches the big letter 'B'?", options: ["d", "p", "q", "b"], correct: "b", visualType: "letters", visualData: { big: "B" } },
      { text: "Which small letter matches the big letter 'R'?", options: ["n", "r", "h", "m"], correct: "r", visualType: "letters", visualData: { big: "R" } },
      { text: "Which small letter matches the big letter 'E'?", options: ["c", "e", "o", "a"], correct: "e", visualType: "letters", visualData: { big: "E" } },
      { text: "Which small letter matches the big letter 'T'?", options: ["f", "l", "t", "i"], correct: "t", visualType: "letters", visualData: { big: "T" } },
      { text: "Which small letter matches the big letter 'H'?", options: ["n", "y", "h", "k"], correct: "h", visualType: "letters", visualData: { big: "H" } },
      { text: "Which small letter matches the big letter 'G'?", options: ["q", "p", "g", "j"], correct: "g", visualType: "letters", visualData: { big: "G" } },
      { text: "Which small letter matches the big letter 'F'?", options: ["t", "f", "j", "l"], correct: "f", visualType: "letters", visualData: { big: "F" } }
    ],
    science: [
      { text: "What color do you get when you mix Red paint and Yellow paint?", options: ["Green", "Orange", "Purple", "Pink"], correct: "Orange", visualType: "colors", visualData: { color1: "#ff3333", color2: "#ffff33" } },
      { text: "What color do you get when you mix Blue paint and Yellow paint?", options: ["Green", "Purple", "Orange", "Brown"], correct: "Green", visualType: "colors", visualData: { color1: "#3333ff", color2: "#ffff33" } },
      { text: "What color do you get when you mix Red paint and Blue paint?", options: ["Green", "Orange", "Purple", "Black"], correct: "Purple", visualType: "colors", visualData: { color1: "#ff3333", color2: "#3333ff" } },
      { text: "What color is a leaf on a tree in summer?", options: ["Blue", "Yellow", "Red", "Green"], correct: "Green", visualType: "colors", visualData: { color1: "#2ecc71", color2: "#2ecc71" } },
      { text: "What color is the bright sky on a sunny day?", options: ["Purple", "Green", "Blue", "Black"], correct: "Blue", visualType: "colors", visualData: { color1: "#3498db", color2: "#3498db" } },
      { text: "What color is a ripe strawberry?", options: ["Red", "Orange", "Green", "Blue"], correct: "Red", visualType: "colors", visualData: { color1: "#e74c3c", color2: "#e74c3c" } },
      { text: "What color is a grape?", options: ["Yellow", "Orange", "Purple", "Blue"], correct: "Purple", visualType: "colors", visualData: { color1: "#8e44ad", color2: "#8e44ad" } },
      { text: "What color is a carrot?", options: ["Yellow", "Orange", "Red", "Pink"], correct: "Orange", visualType: "colors", visualData: { color1: "#e67e22", color2: "#e67e22" } },
      { text: "What color is fresh snow?", options: ["Grey", "White", "Blue", "Yellow"], correct: "White", visualType: "colors", visualData: { color1: "#ffffff", color2: "#ffffff" } },
      { text: "What color is a flamingo?", options: ["Red", "Green", "Pink", "Blue"], correct: "Pink", visualType: "colors", visualData: { color1: "#fd79a8", color2: "#fd79a8" } }
    ],
    test: [
      { text: "What shape is a donut?", options: ["Square", "Triangle", "Circle", "Rectangle"], correct: "Circle", visualType: "textOnly" },
      { text: "Count these fish:", options: ["2", "4", "6", "8"], correct: "4", visualType: "fish", visualData: { count: 4 } },
      { text: "Which small letter matches the big letter 'T'?", options: ["f", "l", "t", "i"], correct: "t", visualType: "letters", visualData: { big: "T" } },
      { text: "What color is a ripe banana?", options: ["Red", "Blue", "Green", "Yellow"], correct: "Yellow", visualType: "colors", visualData: { color1: "#f1c40f", color2: "#f1c40f" } },
      { text: "How many fish are swimming here?", options: ["2", "3", "4", "5"], correct: "2", visualType: "fish", visualData: { count: 2 } },
      { text: "Which small letter matches the big letter 'E'?", options: ["c", "e", "o", "a"], correct: "e", visualType: "letters", visualData: { big: "E" } },
      { text: "What color do you get when you mix Red and Yellow?", options: ["Orange", "Green", "Purple", "Pink"], correct: "Orange", visualType: "colors", visualData: { color1: "#ff3333", color2: "#ffff33" } },
      { text: "Which small letter matches the big letter 'B'?", options: ["d", "p", "q", "b"], correct: "b", visualType: "letters", visualData: { big: "B" } },
      { text: "Count this big school of fish!", options: ["6", "7", "8", "9"], correct: "7", visualType: "fish", visualData: { count: 7 } },
      { text: "What shape is a slice of pizza?", options: ["Square", "Circle", "Triangle", "Oval"], correct: "Triangle", visualType: "textOnly" },
      { text: "Which letter comes first in the alphabet?", options: ["B", "A", "C", "D"], correct: "A", visualType: "textOnly" },
      { text: "What color is healthy grass?", options: ["Green", "Blue", "Yellow", "Orange"], correct: "Green", visualType: "colors", visualData: { color1: "#2ecc71", color2: "#2ecc71" } }
    ]
  },
  
  1: {
    title: "1st Grade",
    math: [
      { text: "What is 2 + 3?", options: ["4", "5", "6", "7"], correct: "5", visualType: "textOnly" },
      { text: "What is 7 - 3?", options: ["3", "4", "5", "6"], correct: "4", visualType: "textOnly" },
      { text: "What is 6 + 4?", options: ["8", "9", "10", "11"], correct: "10", visualType: "textOnly" },
      { text: "What is 10 - 4?", options: ["5", "6", "7", "8"], correct: "6", visualType: "textOnly" },
      { text: "What is 5 + 4?", options: ["7", "8", "9", "10"], correct: "9", visualType: "textOnly" },
      { text: "What is 8 - 5?", options: ["2", "3", "4", "5"], correct: "3", visualType: "textOnly" },
      { text: "What is 9 + 3?", options: ["11", "12", "13", "14"], correct: "12", visualType: "textOnly" },
      { text: "What is 12 - 6?", options: ["4", "5", "6", "7"], correct: "6", visualType: "textOnly" },
      { text: "What is 7 + 7?", options: ["12", "13", "14", "15"], correct: "14", visualType: "textOnly" },
      { text: "What is 15 - 8?", options: ["5", "6", "7", "8"], correct: "7", visualType: "textOnly" }
    ],
    reading: [
      { text: "Spell the name of this cute animal: C - __ - T", options: ["E", "O", "A", "U"], correct: "A", visualType: "textOnly" },
      { text: "What sound does a happy kitty make? M - E - O - __", options: ["W", "Y", "N", "P"], correct: "W", visualType: "textOnly" },
      { text: "What do cats love to eat? F - I - __ - H", options: ["T", "S", "L", "D"], correct: "S", visualType: "textOnly" },
      { text: "Kittens love to run and __ __ A Y.", options: ["P L", "B L", "C L", "F L"], correct: "P L", visualType: "textOnly" },
      { text: "Spell the name of a barking pet: D - __ - G", options: ["A", "O", "I", "U"], correct: "O", visualType: "textOnly" },
      { text: "We go to S - __ - H - O - O - L.", options: ["K", "C", "T", "P"], correct: "C", visualType: "textOnly" },
      { text: "Cats have four soft P - A - __ - S.", options: ["W", "Y", "R", "N"], correct: "W", visualType: "textOnly" },
      { text: "Spell the word: F - L - __ - T", options: ["A", "O", "I", "U"], correct: "A", visualType: "textOnly" },
      { text: "A baby cat is a K - I - T - T - E - __.", options: ["M", "N", "R", "S"], correct: "N", visualType: "textOnly" },
      { text: "Spell: B - __ - O - K", options: ["A", "E", "O", "I"], correct: "O", visualType: "textOnly" }
    ],
    science: [
      { text: "Where does a goldfish live?", options: ["In a nest", "In a tree", "In the water", "In the dirt"], correct: "In the water", visualType: "textOnly" },
      { text: "Where does a baby bird sleep?", options: ["In a nest", "In a cave", "In a pond", "Underground"], correct: "In a nest", visualType: "textOnly" },
      { text: "Which animal lives in a hot desert?", options: ["Penguin", "Polar Bear", "Camel", "Dolphin"], correct: "Camel", visualType: "textOnly" },
      { text: "Which animal has white fur and lives in the cold Arctic?", options: ["Tiger", "Polar Bear", "Elephant", "Kangaroo"], correct: "Polar Bear", visualType: "textOnly" },
      { text: "Where does a tree squirrel usually make its home?", options: ["In a river", "In a tree", "In a cave", "Under the sand"], correct: "In a tree", visualType: "textOnly" },
      { text: "What season is the coldest, with snow?", options: ["Summer", "Autumn", "Spring", "Winter"], correct: "Winter", visualType: "textOnly" },
      { text: "What season has flowers blooming and warm weather?", options: ["Winter", "Summer", "Spring", "Autumn"], correct: "Spring", visualType: "textOnly" },
      { text: "Which animal spins silk thread to make webs?", options: ["Bee", "Ant", "Caterpillar", "Spider"], correct: "Spider", visualType: "textOnly" },
      { text: "Where does an earthworm live?", options: ["In a tree", "In the dirt", "In the air", "In the sea"], correct: "In the dirt", visualType: "textOnly" },
      { text: "Which bird sleeps during the day and hunts at night?", options: ["Eagle", "Robin", "Owl", "Parrot"], correct: "Owl", visualType: "textOnly" }
    ],
    test: [
      { text: "What is 5 + 5?", options: ["8", "9", "10", "12"], correct: "10", visualType: "textOnly" },
      { text: "Spell the word: D - __ - G", options: ["A", "O", "I", "U"], correct: "O", visualType: "textOnly" },
      { text: "What animal builds a web to catch flies?", options: ["Ant", "Spider", "Frog", "Bee"], correct: "Spider", visualType: "textOnly" },
      { text: "What is 9 - 4?", options: ["3", "4", "5", "6"], correct: "5", visualType: "textOnly" },
      { text: "What is 3 + 6?", options: ["7", "8", "9", "10"], correct: "9", visualType: "textOnly" },
      { text: "Where does a polar bear live?", options: ["Desert", "Forest", "Arctic", "Jungle"], correct: "Arctic", visualType: "textOnly" },
      { text: "What is 8 - 3?", options: ["3", "4", "5", "6"], correct: "5", visualType: "textOnly" },
      { text: "Spell this cute feline: C - __ - T", options: ["E", "O", "A", "U"], correct: "A", visualType: "textOnly" },
      { text: "Where does a goldfish live?", options: ["In a tree", "In a nest", "In the water", "In the dirt"], correct: "In the water", visualType: "textOnly" },
      { text: "What is 10 + 7?", options: ["15", "16", "17", "18"], correct: "17", visualType: "textOnly" },
      { text: "What animal hops and has long ears?", options: ["Rabbit", "Dog", "Bear", "Cat"], correct: "Rabbit", visualType: "textOnly" },
      { text: "What is 12 - 4?", options: ["6", "7", "8", "9"], correct: "8", visualType: "textOnly" }
    ]
  },

  2: {
    title: "2nd Grade",
    math: [
      { text: "What time is shown on this clock?", options: ["3:00", "12:15", "9:00", "6:00"], correct: "3:00", visualType: "clock", visualData: { hour: 3, minute: 0 } },
      { text: "What time is shown on this clock?", options: ["6:00", "6:30", "7:30", "12:30"], correct: "6:30", visualType: "clock", visualData: { hour: 6, minute: 30 } },
      { text: "What time is shown on this clock?", options: ["10:00", "10:15", "11:15", "9:15"], correct: "10:15", visualType: "clock", visualData: { hour: 10, minute: 15 } },
      { text: "What time is shown on this clock?", options: ["1:45", "2:45", "12:45", "9:05"], correct: "1:45", visualType: "clock", visualData: { hour: 1, minute: 45 } },
      { text: "What time is shown on this clock?", options: ["12:00", "12:30", "6:00", "3:00"], correct: "12:00", visualType: "clock", visualData: { hour: 12, minute: 0 } },
      { text: "What time is shown on this clock?", options: ["8:15", "9:15", "8:45", "7:15"], correct: "8:15", visualType: "clock", visualData: { hour: 8, minute: 15 } },
      { text: "What time is shown on this clock?", options: ["5:30", "6:30", "5:00", "4:30"], correct: "5:30", visualType: "clock", visualData: { hour: 5, minute: 30 } },
      { text: "What time is shown on this clock?", options: ["11:45", "12:45", "11:15", "10:45"], correct: "11:45", visualType: "clock", visualData: { hour: 11, minute: 45 } },
      { text: "What time is shown on this clock?", options: ["2:00", "12:10", "3:00", "1:00"], correct: "2:00", visualType: "clock", visualData: { hour: 2, minute: 0 } },
      { text: "What time is shown on this clock?", options: ["7:45", "8:45", "6:45", "7:15"], correct: "7:45", visualType: "clock", visualData: { hour: 7, minute: 45 } }
    ],
    reading: [
      { text: "What is a synonym (word with same meaning) for 'Happy'?", options: ["Sad", "Glad", "Angry", "Sleepy"], correct: "Glad", visualType: "textOnly" },
      { text: "What is the antonym (opposite meaning) of 'Big'?", options: ["Large", "Huge", "Small", "Tall"], correct: "Small", visualType: "textOnly" },
      { text: "What is a synonym for 'Fast'?", options: ["Quick", "Slow", "Quiet", "Heavy"], correct: "Quick", visualType: "textOnly" },
      { text: "What is the antonym of 'Hot'?", options: ["Warm", "Spicy", "Cold", "Sunny"], correct: "Cold", visualType: "textOnly" },
      { text: "What is a synonym for 'Sleepy'?", options: ["Tired", "Awake", "Loud", "Active"], correct: "Tired", visualType: "textOnly" },
      { text: "What is the antonym of 'Wet'?", options: ["Damp", "Dry", "Soggy", "Rainy"], correct: "Dry", visualType: "textOnly" },
      { text: "What is a synonym for 'Silent'?", options: ["Quiet", "Noisy", "Shouting", "Soft"], correct: "Quiet", visualType: "textOnly" },
      { text: "What is the antonym of 'Hard'?", options: ["Solid", "Soft", "Firm", "Rough"], correct: "Soft", visualType: "textOnly" },
      { text: "What is a synonym for 'Smart'?", options: ["Clever", "Dull", "Silly", "Kind"], correct: "Clever", visualType: "textOnly" },
      { text: "What is the antonym of 'Slow'?", options: ["Heavy", "Fast", "Steady", "Lazy"], correct: "Fast", visualType: "textOnly" }
    ],
    science: [
      { text: "What does a green plant start its life as?", options: ["A leaf", "A seed", "A flower", "A branch"], correct: "A seed", visualType: "textOnly" },
      { text: "What grows underground to soak up water for the plant?", options: ["Roots", "Leaves", "Flowers", "Stem"], correct: "Roots", visualType: "textOnly" },
      { text: "What two things does a plant need most to grow healthy?", options: ["Soda and cookies", "Sunlight and water", "Soil and ice", "Wind and rocks"], correct: "Sunlight and water", visualType: "textOnly" },
      { text: "What parts of the plant grow to make seeds for new plants?", options: ["Roots", "Stem", "Flowers or Fruit", "Thorns"], correct: "Flowers or Fruit", visualType: "textOnly" },
      { text: "Which part of a plant uses sunlight to make food?", options: ["Roots", "Leaves", "Stem", "Petals"], correct: "Leaves", visualType: "textOnly" },
      { text: "Which insect helps flowers grow by carrying pollen between them?", options: ["Ant", "Mosquito", "Honeybee", "Fly"], correct: "Honeybee", visualType: "textOnly" },
      { text: "What supports the plant above ground and carries water to the leaves?", options: ["Roots", "Stem", "Petals", "Fruit"], correct: "Stem", visualType: "textOnly" },
      { text: "What gas do plants release into the air that humans need to breathe?", options: ["Nitrogen", "Carbon Dioxide", "Oxygen", "Water Vapor"], correct: "Oxygen", visualType: "textOnly" },
      { text: "What turns green plants their green color?", options: ["Water", "Soil", "Chlorophyll", "Sunlight"], correct: "Chlorophyll", visualType: "textOnly" },
      { text: "How do deciduous trees change in Autumn?", options: ["They grow flowers", "Their leaves fall off", "They grow taller", "They sleep"], correct: "Their leaves fall off", visualType: "textOnly" }
    ],
    test: [
      { text: "What time is shown on this clock?", options: ["8:30", "9:30", "6:40", "8:00"], correct: "8:30", visualType: "clock", visualData: { hour: 8, minute: 30 } },
      { text: "What is the opposite (antonym) of 'Up'?", options: ["High", "Down", "Left", "Right"], correct: "Down", visualType: "textOnly" },
      { text: "Plants absorb water through their:", options: ["Leaves", "Roots", "Petals", "Branches"], correct: "Roots", visualType: "textOnly" },
      { text: "What is 15 + 12?", options: ["25", "27", "29", "37"], correct: "27", visualType: "textOnly" },
      { text: "What is the opposite (antonym) of 'Left'?", options: ["Right", "Down", "Up", "Behind"], correct: "Right", visualType: "textOnly" },
      { text: "What time is shown on this clock?", options: ["9:00", "12:45", "3:00", "6:00"], correct: "9:00", visualType: "clock", visualData: { hour: 9, minute: 0 } },
      { text: "What is a synonym for 'Glad'?", options: ["Sad", "Happy", "Mad", "Tired"], correct: "Happy", visualType: "textOnly" },
      { text: "What grows underground?", options: ["Leaves", "Flowers", "Roots", "Stems"], correct: "Roots", visualType: "textOnly" },
      { text: "What is 20 + 35?", options: ["45", "50", "55", "60"], correct: "55", visualType: "textOnly" },
      { text: "What does a plant grow from?", options: ["A leaf", "A seed", "A branch", "A root"], correct: "A seed", visualType: "textOnly" },
      { text: "What is the opposite of 'Cold'?", options: ["Hot", "Cool", "Freezing", "Chilly"], correct: "Hot", visualType: "textOnly" },
      { text: "What time is shown on this clock?", options: ["4:30", "5:30", "3:30", "6:30"], correct: "4:30", visualType: "clock", visualData: { hour: 4, minute: 30 } }
    ],
    typing: [
      { text: "Type the word correctly!", correct: "cat", visualType: "typing", visualData: { word: "cat" } },
      { text: "Type the word correctly!", correct: "paw", visualType: "typing", visualData: { word: "paw" } },
      { text: "Type the word correctly!", correct: "milk", visualType: "typing", visualData: { word: "milk" } },
      { text: "Type the word correctly!", correct: "yarn", visualType: "typing", visualData: { word: "yarn" } },
      { text: "Type the word correctly!", correct: "fish", visualType: "typing", visualData: { word: "fish" } },
      { text: "Type the word correctly!", correct: "toy", visualType: "typing", visualData: { word: "toy" } },
      { text: "Type the word correctly!", correct: "nap", visualType: "typing", visualData: { word: "nap" } },
      { text: "Type the word correctly!", correct: "fur", visualType: "typing", visualData: { word: "fur" } },
      { text: "Type the word correctly!", correct: "claw", visualType: "typing", visualData: { word: "claw" } },
      { text: "Type the word correctly!", correct: "purr", visualType: "typing", visualData: { word: "purr" } }
    ]
  },

  3: {
    title: "3rd Grade",
    math: [
      { text: "What is 3 x 4?", options: ["7", "10", "12", "15"], correct: "12", visualType: "textOnly" },
      { text: "What is 5 x 6?", options: ["11", "25", "30", "35"], correct: "30", visualType: "textOnly" },
      { text: "What is 12 / 3?", options: ["3", "4", "5", "6"], correct: "4", visualType: "textOnly" },
      { text: "What is 8 x 7?", options: ["48", "54", "56", "64"], correct: "56", visualType: "textOnly" },
      { text: "What is 9 x 2?", options: ["11", "16", "18", "20"], correct: "18", visualType: "textOnly" },
      { text: "What is 24 / 4?", options: ["5", "6", "7", "8"], correct: "6", visualType: "textOnly" },
      { text: "What is 7 x 6?", options: ["36", "40", "42", "48"], correct: "42", visualType: "textOnly" },
      { text: "What is 40 / 5?", options: ["6", "7", "8", "9"], correct: "8", visualType: "textOnly" },
      { text: "What is 9 x 9?", options: ["72", "80", "81", "90"], correct: "81", visualType: "textOnly" },
      { text: "What is 63 / 7?", options: ["7", "8", "9", "10"], correct: "9", visualType: "textOnly" }
    ],
    reading: [
      { text: "Find the NOUN (naming word) in: 'The fuzzy cat runs fast.'", options: ["cat", "fuzzy", "runs", "fast"], correct: "cat", visualType: "textOnly" },
      { text: "Find the VERB (action word) in: 'The tiny kitten sleeps on the rug.'", options: ["kitten", "tiny", "sleeps", "rug"], correct: "sleeps", visualType: "textOnly" },
      { text: "Find the ADJECTIVE (describing word) in: 'Three cute mice squeaked.'", options: ["Three", "cute", "mice", "squeaked"], correct: "cute", visualType: "textOnly" },
      { text: "What is the plural of the word 'mouse'?", options: ["mouses", "mice", "mices", "mouse"], correct: "mice", visualType: "textOnly" },
      { text: "Find the NOUN in this sentence: 'Oliver chased the red ball.'", options: ["Oliver", "chased", "red", "ball"], correct: "Oliver", visualType: "textOnly" },
      { text: "Find the ADJECTIVE in: 'A warm blanket keeps me cozy.'", options: ["blanket", "warm", "keeps", "cozy"], correct: "warm", visualType: "textOnly" },
      { text: "Find the VERB in: 'The students listen to the teacher.'", options: ["students", "listen", "teacher", "to"], correct: "listen", visualType: "textOnly" },
      { text: "What is the plural of the word 'child'?", options: ["childs", "childes", "children", "childrens"], correct: "children", visualType: "textOnly" },
      { text: "Find the NOUN in: 'The library is full of interesting books.'", options: ["library", "interesting", "full", "of"], correct: "library", visualType: "textOnly" },
      { text: "What is the plural of the word 'goose'?", options: ["gooses", "geese", "geeses", "goose"], correct: "geese", visualType: "textOnly" }
    ],
    science: [
      { text: "What state of matter is the water we drink?", options: ["Solid", "Liquid", "Gas", "Plasma"], correct: "Liquid", visualType: "textOnly" },
      { text: "What state of matter is a cold block of ice?", options: ["Liquid", "Solid", "Gas", "Vapor"], correct: "Solid", visualType: "textOnly" },
      { text: "What state of matter is steam coming from hot tea?", options: ["Solid", "Liquid", "Gas", "Ice"], correct: "Gas", visualType: "textOnly" },
      { text: "Which state of matter holds its own shape and doesn't flow?", options: ["Liquid", "Gas", "Solid", "All of them"], correct: "Solid", visualType: "textOnly" },
      { text: "What state of matter is the helium gas inside a party balloon?", options: ["Solid", "Liquid", "Gas", "Plasma"], correct: "Gas", visualType: "textOnly" },
      { text: "What happens to liquid water when it gets very cold and freezes?", options: ["It turns to gas", "It turns to solid", "It disappears", "It boils"], correct: "It turns to solid", visualType: "textOnly" },
      { text: "What is the process of liquid water heating up and turning into water vapor?", options: ["Condensation", "Evaporation", "Freezing", "Melting"], correct: "Evaporation", visualType: "textOnly" },
      { text: "What is the process of water vapor cooling down and turning back into liquid?", options: ["Evaporation", "Condensation", "Precipitation", "Melting"], correct: "Condensation", visualType: "textOnly" },
      { text: "Which state of matter takes the shape of its container and can be poured?", options: ["Solid", "Liquid", "Gas", "None"], correct: "Liquid", visualType: "textOnly" },
      { text: "What state of matter is wood?", options: ["Solid", "Liquid", "Gas", "Plasma"], correct: "Solid", visualType: "textOnly" }
    ],
    test: [
      { text: "What is 9 x 3?", options: ["24", "26", "27", "28"], correct: "27", visualType: "textOnly" },
      { text: "Find the verb: 'Milo jumps over the puddle.'", options: ["Milo", "jumps", "over", "puddle"], correct: "jumps", visualType: "textOnly" },
      { text: "What state of matter is the air inside a balloon?", options: ["Solid", "Liquid", "Gas", "Solid & Liquid"], correct: "Gas", visualType: "textOnly" },
      { text: "What is 20 / 4?", options: ["4", "5", "6", "8"], correct: "5", visualType: "textOnly" },
      { text: "What is the plural of 'mouse'?", options: ["mouses", "mice", "mices", "mousey"], correct: "mice", visualType: "textOnly" },
      { text: "What is 6 x 4?", options: ["10", "20", "24", "28"], correct: "24", visualType: "textOnly" },
      { text: "Find the noun: 'The red car drives fast.'", options: ["red", "car", "drives", "fast"], correct: "car", visualType: "textOnly" },
      { text: "What state of matter is ice?", options: ["Solid", "Liquid", "Gas", "Plasma"], correct: "Solid", visualType: "textOnly" },
      { text: "What is 45 / 9?", options: ["4", "5", "6", "7"], correct: "5", visualType: "textOnly" },
      { text: "Find the adjective: 'The large elephant walked slowly.'", options: ["large", "elephant", "walked", "slowly"], correct: "large", visualType: "textOnly" },
      { text: "What is 8 x 8?", options: ["56", "60", "64", "72"], correct: "64", visualType: "textOnly" },
      { text: "What is the process of water boiling into steam?", options: ["Evaporation", "Freezing", "Condensation", "Melting"], correct: "Evaporation", visualType: "textOnly" }
    ],
    typing: [
      { text: "Type the word correctly!", correct: "computer", visualType: "typing", visualData: { word: "computer" } },
      { text: "Type the word correctly!", correct: "elementary", visualType: "typing", visualData: { word: "elementary" } },
      { text: "Type the word correctly!", correct: "monitor", visualType: "typing", visualData: { word: "monitor" } },
      { text: "Type the word correctly!", correct: "scrolling", visualType: "typing", visualData: { word: "scrolling" } },
      { text: "Type the word correctly!", correct: "pouncing", visualType: "typing", visualData: { word: "pouncing" } },
      { text: "Type the word correctly!", correct: "scratchpad", visualType: "typing", visualData: { word: "scratchpad" } },
      { text: "Type the word correctly!", correct: "internet", visualType: "typing", visualData: { word: "internet" } },
      { text: "Type the word correctly!", correct: "password", visualType: "typing", visualData: { word: "password" } },
      { text: "Type the word correctly!", correct: "catnip", visualType: "typing", visualData: { word: "catnip" } },
      { text: "Type the word correctly!", correct: "feathers", visualType: "typing", visualData: { word: "feathers" } }
    ]
  },

  4: {
    title: "4th Grade",
    math: [
      { text: "You cut a fish pie into 4 equal slices and eat 1 slice. What fraction is left?", options: ["1/4", "2/4", "3/4", "4/4"], correct: "3/4", visualType: "textOnly" },
      { text: "What is 2/5 + 1/5?", options: ["3/10", "3/5", "2/5", "1/5"], correct: "3/5", visualType: "textOnly" },
      { text: "Which of these fractions is the largest?", options: ["1/2", "1/4", "1/8", "1/10"], correct: "1/2", visualType: "textOnly" },
      { text: "If a rectangular rug is 5 feet long and 4 feet wide, what is its area?", options: ["9 sq ft", "18 sq ft", "20 sq ft", "24 sq ft"], correct: "20 sq ft", visualType: "textOnly" },
      { text: "If a rectangular rug is 5 feet long and 4 feet wide, what is its perimeter?", options: ["9 feet", "14 feet", "18 feet", "20 feet"], correct: "18 feet", visualType: "textOnly" },
      { text: "What is 5/10 - 2/10?", options: ["3/10", "3/20", "7/10", "1/10"], correct: "3/10", visualType: "textOnly" },
      { text: "What is the value of the digit 7 in the number 4,732?", options: ["7", "70", "700", "7,000"], correct: "700", visualType: "textOnly" },
      { text: "What is 12 x 11?", options: ["121", "132", "144", "150"], correct: "132", visualType: "textOnly" },
      { text: "What is the area of a square garden with side lengths of 6 meters?", options: ["12 sq m", "24 sq m", "36 sq m", "48 sq m"], correct: "36 sq m", visualType: "textOnly" },
      { text: "What is 3/4 equivalent to?", options: ["6/8", "12/16", "9/12", "All of them"], correct: "All of them", visualType: "textOnly" }
    ],
    reading: [
      { text: "Which sentence is written correctly?", options: ["They are playing with yarn.", "Their playing with yarn.", "There playing with yarn.", "Them are playing with yarn."], correct: "They are playing with yarn.", visualType: "textOnly" },
      { text: "Which sentence has correct capitalization?", options: ["we went to paris in July.", "We went to paris in july.", "We went to Paris in July.", "we went to Paris in july."], correct: "We went to Paris in July.", visualType: "textOnly" },
      { text: "Which sentence should end with a question mark (?)?", options: ["I love eating tuna fish", "What time does school start", "The sky is blue today", "Go clean up your room"], correct: "What time does school start", visualType: "textOnly" },
      { text: "What is the past tense of the verb 'run'?", options: ["runned", "running", "ran", "runs"], correct: "ran", visualType: "textOnly" },
      { text: "Fill in the blank: '____ cat is sleeping on the couch.'", options: ["Their", "They're", "There", "Them"], correct: "Their", visualType: "textOnly" },
      { text: "What is the past tense of the verb 'eat'?", options: ["eated", "ate", "eating", "eaten"], correct: "ate", visualType: "textOnly" },
      { text: "Which word is a homophone for 'hear'?", options: ["here", "hare", "hair", "heir"], correct: "here", visualType: "textOnly" },
      { text: "Identify the prefix in the word 'unhappy':", options: ["un", "happy", "ha", "py"], correct: "un", visualType: "textOnly" },
      { text: "Identify the suffix in the word 'careful':", options: ["care", "ful", "ca", "re"], correct: "ful", visualType: "textOnly" },
      { text: "Which word means 'to write again'?", options: ["Prewrite", "Rewrite", "Unwrite", "Dewrite"], correct: "Rewrite", visualType: "textOnly" }
    ],
    science: [
      { text: "Which planet in our solar system is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correct: "Mercury", visualType: "textOnly" },
      { text: "Which planet is famous for its reddish color and is called the Red Planet?", options: ["Jupiter", "Mars", "Saturn", "Neptune"], correct: "Mars", visualType: "textOnly" },
      { text: "What is the primary source of light and energy for the Earth?", options: ["The Moon", "The Sun", "Volcanoes", "Lightning"], correct: "The Sun", visualType: "textOnly" },
      { text: "What do we call animals that eat only plants, like rabbits and deer?", options: ["Carnivores", "Herbivores", "Omnivores", "Producers"], correct: "Herbivores", visualType: "textOnly" },
      { text: "How long does it take for Earth to complete one full trip around the Sun?", options: ["24 Hours", "30 Days", "365 Days (1 Year)", "10 Years"], correct: "365 Days (1 Year)", visualType: "textOnly" },
      { text: "What do we call animals that eat only other animals, like lions and eagles?", options: ["Herbivores", "Omnivores", "Carnivores", "Producers"], correct: "Carnivores", visualType: "textOnly" },
      { text: "What force keeps the Moon in orbit around the Earth?", options: ["Friction", "Magnetism", "Gravity", "Wind"], correct: "Gravity", visualType: "textOnly" },
      { text: "What is the invisible shield of gas surrounding the Earth?", options: ["Hydrosphere", "Atmosphere", "Lithosphere", "Biosphere"], correct: "Atmosphere", visualType: "textOnly" },
      { text: "How long does it take for Earth to rotate once on its own axis?", options: ["12 Hours", "24 Hours (1 Day)", "30 Days", "365 Days"], correct: "24 Hours (1 Day)", visualType: "textOnly" },
      { text: "What type of energy do we get from vibrating strings?", options: ["Heat", "Light", "Sound", "Electrical"], correct: "Sound", visualType: "textOnly" }
    ],
    test: [
      { text: "What is 3/8 + 4/8?", options: ["7/16", "7/8", "12/8", "1/8"], correct: "7/8", visualType: "textOnly" },
      { text: "What is the past tense of 'sing'?", options: ["singed", "sings", "sang", "sung"], correct: "sang", visualType: "textOnly" },
      { text: "Which animal is a herbivore?", options: ["Lion", "Shark", "Cow", "Eagle"], correct: "Cow", visualType: "textOnly" },
      { text: "Solve: 120 - 45 =", options: ["65", "75", "85", "95"], correct: "75", visualType: "textOnly" },
      { text: "What is the area of a rug that is 6 feet long and 5 feet wide?", options: ["11 sq ft", "22 sq ft", "30 sq ft", "36 sq ft"], correct: "30 sq ft", visualType: "textOnly" },
      { text: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correct: "Mercury", visualType: "textOnly" },
      { text: "What is the past tense of 'run'?", options: ["runned", "ran", "runs", "running"], correct: "ran", visualType: "textOnly" },
      { text: "What is 10/12 - 4/12?", options: ["6/12", "6/24", "14/12", "2/12"], correct: "6/12", visualType: "textOnly" },
      { text: "What planet is called the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: "Mars", visualType: "textOnly" },
      { text: "Which word is homophone for 'hear'?", options: ["here", "hair", "hare", "heir"], correct: "here", visualType: "textOnly" },
      { text: "How long does Earth take to go around the Sun?", options: ["24 Hours", "30 Days", "365 Days", "10 Years"], correct: "365 Days", visualType: "textOnly" },
      { text: "What is the perimeter of a 4x4 square?", options: ["8", "12", "16", "20"], correct: "16", visualType: "textOnly" }
    ],
    typing: [
      { text: "Type the word before it hits the bottom!", correct: "mouse", visualType: "typing", visualData: { word: "mouse" } },
      { text: "Type the word before it hits the bottom!", correct: "screen", visualType: "typing", visualData: { word: "screen" } },
      { text: "Type the word before it hits the bottom!", correct: "click", visualType: "typing", visualData: { word: "click" } },
      { text: "Type the word before it hits the bottom!", correct: "laptop", visualType: "typing", visualData: { word: "laptop" } },
      { text: "Type the word before it hits the bottom!", correct: "button", visualType: "typing", visualData: { word: "button" } },
      { text: "Type the word before it hits the bottom!", correct: "pixels", visualType: "typing", visualData: { word: "pixels" } },
      { text: "Type the word before it hits the bottom!", correct: "scroll", visualType: "typing", visualData: { word: "scroll" } },
      { text: "Type the word before it hits the bottom!", correct: "kitten", visualType: "typing", visualData: { word: "kitten" } },
      { text: "Type the word before it hits the bottom!", correct: "gamepad", visualType: "typing", visualData: { word: "gamepad" } },
      { text: "Type the word before it hits the bottom!", correct: "whisker", visualType: "typing", visualData: { word: "whisker" } }
    ]
  },

  5: {
    title: "5th Grade",
    math: [
      { text: "Solve for x: x + 5 = 12", options: ["5", "7", "8", "17"], correct: "7", visualType: "textOnly" },
      { text: "What is 0.5 x 10?", options: ["0.05", "5", "50", "500"], correct: "5", visualType: "textOnly" },
      { text: "Solve for y: 2y = 16", options: ["6", "8", "14", "32"], correct: "8", visualType: "textOnly" },
      { text: "What is 1.2 + 2.35?", options: ["3.37", "3.55", "3.57", "2.47"], correct: "3.55", visualType: "textOnly" },
      { text: "Solve for x: 3x = 15", options: ["3", "5", "8", "12"], correct: "5", visualType: "textOnly" },
      { text: "What is 1/2 x 1/3?", options: ["1/6", "2/5", "1/5", "5/6"], correct: "1/6", visualType: "textOnly" },
      { text: "What is 2.5 + 4.75?", options: ["6.25", "7.25", "7.5", "8.0"], correct: "7.25", visualType: "textOnly" },
      { text: "Solve for y: y - 8 = 15", options: ["7", "13", "23", "30"], correct: "23", visualType: "textOnly" },
      { text: "What is 12.6 / 3?", options: ["3.2", "4.2", "4.3", "5.2"], correct: "4.2", visualType: "textOnly" },
      { text: "What is 3/5 + 1/10?", options: ["4/15", "7/10", "4/10", "1/2"], correct: "7/10", visualType: "textOnly" }
    ],
    reading: [
      { text: "What does the word 'gigantic' mean in a story?", options: ["Extremely small", "Extremely large", "Very noisy", "Brightly colored"], correct: "Extremely large", visualType: "textOnly" },
      { text: "If a character is described as 'benevolent', they are:", options: ["Mean and greedy", "Kind and helpful", "Loud and clumsy", "Scared and weak"], correct: "Kind and helpful", visualType: "textOnly" },
      { text: "What is the 'theme' of a story or fable?", options: ["The list of characters", "Where the story takes place", "The main message or life lesson", "The name of the author"], correct: "The main message or life lesson", visualType: "textOnly" },
      { text: "What does the word 'diligent' mean?", options: ["Lazy and careless", "Hard-working and careful", "Fast and reckless", "Slow and sleepy"], correct: "Hard-working and careful", visualType: "textOnly" },
      { text: "Identify the metaphor: 'The classroom was a ______.'", options: ["zoo", "room", "quiet place", "box of crayons"], correct: "zoo", visualType: "textOnly" },
      { text: "If a character is 'melancholy', they feel:", options: ["Very happy", "Extremely sad", "Terrified", "Excited"], correct: "Extremely sad", visualType: "textOnly" },
      { text: "What is a 'protagonist' in a novel?", options: ["The main villain", "The main character", "The narrator", "A minor side character"], correct: "The main character", visualType: "textOnly" },
      { text: "What is an 'antagonist' in a novel?", options: ["The hero", "The opponent or villain", "The author", "The publisher"], correct: "The opponent or villain", visualType: "textOnly" },
      { text: "What does it mean to 'infer' something from a passage?", options: ["To copy it word-for-word", "To make an educated guess based on clues", "To ignore it", "To rewrite it entirely"], correct: "To make an educated guess based on clues", visualType: "textOnly" },
      { text: "Identify the simile: 'He was as brave as a ______.'", options: ["lion", "coward", "stone", "shadow"], correct: "lion", visualType: "textOnly" }
    ],
    science: [
      { text: "What kind of organism sits at the very start of a food chain, making its own food?", options: ["Herbivore", "Carnivore", "Decomposer", "Producer (Plants)"], correct: "Producer (Plants)", visualType: "textOnly" },
      { text: "Which organ is responsible for pumping blood all around your body?", options: ["Lungs", "Brain", "Heart", "Stomach"], correct: "Heart", visualType: "textOnly" },
      { text: "What gas do humans breathe out and plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], correct: "Carbon Dioxide", visualType: "textOnly" },
      { text: "What is the role of decomposers like mushrooms and bacteria in an ecosystem?", options: ["To hunt live animals", "To eat green leaves", "To break down dead plants and animals", "To produce sunlight"], correct: "To break down dead plants and animals", visualType: "textOnly" },
      { text: "What force pulls objects toward the center of the Earth?", options: ["Friction", "Gravity", "Magnetism", "Wind"], correct: "Gravity", visualType: "textOnly" },
      { text: "Which organ pulls oxygen from the air into your bloodstream?", options: ["Heart", "Lungs", "Brain", "Liver"], correct: "Lungs", visualType: "textOnly" },
      { text: "What substance in red blood cells binds to and carries oxygen?", options: ["Chlorophyll", "Hemoglobin", "Plasma", "Insulin"], correct: "Hemoglobin", visualType: "textOnly" },
      { text: "What is the boiling point of pure water at sea level?", options: ["0 °C", "50 °C", "100 °C", "200 °C"], correct: "100 °C", visualType: "textOnly" },
      { text: "What is the freezing point of pure water at sea level?", options: ["-10 °C", "0 °C", "10 °C", "32 °C"], correct: "0 °C", visualType: "textOnly" },
      { text: "Which system of the body is made of bones and protects organs?", options: ["Nervous", "Skeletal", "Muscular", "Digestive"], correct: "Skeletal", visualType: "textOnly" }
    ],
    test: [
      { text: "Solve for x: 3x - 4 = 11", options: ["3", "4", "5", "6"], correct: "5", visualType: "textOnly" },
      { text: "What is the term for an animal that eats both plants and meat?", options: ["Herbivore", "Carnivore", "Omnivore", "Producer"], correct: "Omnivore", visualType: "textOnly" },
      { text: "Choose the correct meaning of 'frugal':", options: ["Wasteful with money", "Careful with spending", "Very hungry", "Angry"], correct: "Careful with spending", visualType: "textOnly" },
      { text: "What is 4.8 / 2?", options: ["2.2", "2.4", "2.8", "9.6"], correct: "2.4", visualType: "textOnly" },
      { text: "What is the 'theme' of a fable?", options: ["The character names", "The main life lesson", "The setting", "The resolution"], correct: "The main life lesson", visualType: "textOnly" },
      { text: "Which organ pumps blood in a cat's body?", options: ["Lungs", "Stomach", "Heart", "Brain"], correct: "Heart", visualType: "textOnly" },
      { text: "Solve for y: 2y + 10 = 26?", options: ["6", "8", "10", "12"], correct: "8", visualType: "textOnly" },
      { text: "What does 'benevolent' mean?", options: ["Greedy", "Kind", "Loud", "Scared"], correct: "Kind", visualType: "textOnly" },
      { text: "What gas do humans breathe out?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], correct: "Carbon Dioxide", visualType: "textOnly" },
      { text: "What is 1/2 x 1/3?", options: ["1/5", "1/6", "2/5", "5/6"], correct: "1/6", visualType: "textOnly" },
      { text: "What force pulls things to Earth?", options: ["Friction", "Gravity", "Wind", "Magnetism"], correct: "Gravity", visualType: "textOnly" },
      { text: "What is a protagonist?", options: ["The villain", "The main hero", "The author", "A sidekick"], correct: "The main hero", visualType: "textOnly" }
    ],
    typing: [
      { text: "Type the word before it hits the bottom!", correct: "website", visualType: "typing", visualData: { word: "website" } },
      { text: "Type the word before it hits the bottom!", correct: "network", visualType: "typing", visualData: { word: "network" } },
      { text: "Type the word before it hits the bottom!", correct: "pouncing", visualType: "typing", visualData: { word: "pouncing" } },
      { text: "Type the word before it hits the bottom!", correct: "science", visualType: "typing", visualData: { word: "science" } },
      { text: "Type the word before it hits the bottom!", correct: "history", visualType: "typing", visualData: { word: "history" } },
      { text: "Type the word before it hits the bottom!", correct: "classroom", visualType: "typing", visualData: { word: "classroom" } },
      { text: "Type the word before it hits the bottom!", correct: "teacher", visualType: "typing", visualData: { word: "teacher" } },
      { text: "Type the word before it hits the bottom!", correct: "student", visualType: "typing", visualData: { word: "student" } },
      { text: "Type the word before it hits the bottom!", correct: "diploma", visualType: "typing", visualData: { word: "diploma" } },
      { text: "Type the word before it hits the bottom!", correct: "balloons", visualType: "typing", visualData: { word: "balloons" } }
    ]
  }
};

export const BOSS_QUESTIONS = [
  { text: "What is 8 x 9?", options: ["64", "72", "81", "90"], correct: "72" },
  { text: "Find the adjective: 'The lazy cat took a long nap.'", options: ["cat", "took", "lazy", "nap"], correct: "lazy" },
  { text: "What gas do humans breathe in to live?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correct: "Oxygen" },
  { text: "Solve for x: 2x + 10 = 20", options: ["2", "5", "10", "15"], correct: "5" },
  { text: "What is a synonym for 'Huge'?", options: ["Tiny", "Gigantic", "Heavy", "Loud"], correct: "Gigantic" },
  { text: "What is 3/10 + 4/10?", options: ["7/10", "7/20", "12/10", "1/10"], correct: "7/10" },
  { text: "Where does a polar bear live?", options: ["Desert", "Jungle", "Arctic", "Forest"], correct: "Arctic" },
  { text: "Spell the word: M - E - __ - W", options: ["O", "A", "I", "U"], correct: "O" }
];
