const size = 7;
const weightIncrease = 1;
const weightMultiple = 10;
const initWeight = (size - weightIncrease) * weightMultiple;
const weights = Array(size).fill(initWeight);
const weightDecrease = size - weightIncrease;
const totalWeight = size * initWeight;

function weightedRandomSelect() {
  let selected = -1;

  // 1. cummulative weights
  const cumulativeWeights = [];
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
  }
  // 2. get random number
  const randomNumber = totalWeight * Math.random();

  // 3. pick random item
  for (let itemIndex = 0; itemIndex < size; itemIndex += 1) {
    if (cumulativeWeights[itemIndex] >= randomNumber) {
      selected = itemIndex;
      break;
    }
  }

  if (selected > -1) {
    for (let i = 0; i < size; i++) {
      if (i === selected) {
        weights[i] -= weightDecrease;
      } else {
        weights[i] += weightIncrease;
      }
    }
  }

  return selected;
}

const freq = Object.fromEntries(Array(size).fill(0).map((item, index) => {
  return [index, item]
}));

for (let i = 0; i < 100; i++) {
  console.log(`RUN NUMBER ${i + 1}:`);
  console.log("init weights", weights);
  const selected = weightedRandomSelect();
  freq[selected] += 1;
  console.log("selected index", selected);
  console.log("new weights", weights);
}

console.log(freq);


