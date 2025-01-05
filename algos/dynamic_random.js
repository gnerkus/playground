const size = 7;
const weightIncrease = 1;
const weightMultiple = 10;
const initWeight = (size - weightIncrease) * weightMultiple;
const weights = Array(size).fill(initWeight);
const nonDynamicWeights = [...weights];
const weightDecrease = size - weightIncrease;
const totalWeight = size * initWeight;

function weightedRandomSelect(isDynamic, listOfWeights) {
  let selected = -1;

  // 1. cummulative weights
  const cumulativeWeights = [];
  for (let i = 0; i < listOfWeights.length; i += 1) {
    cumulativeWeights[i] = listOfWeights[i] + (cumulativeWeights[i - 1] || 0);
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

  if (isDynamic) {
    if (selected > -1) {
      for (let i = 0; i < size; i++) {
        if (i === selected) {
          listOfWeights[i] -= weightDecrease;
        } else {
          listOfWeights[i] += weightIncrease;
        }
      }
    }
  }


  return selected;
}

const freq = Object.fromEntries(Array(size).fill(0).map((item, index) => {
  return [index, item]
}));
const nonDynamicFreq = {...freq};

for (let i = 0; i < size * 100; i++) {
  const selected = weightedRandomSelect(true, weights);
  const ndSelected = weightedRandomSelect(false, nonDynamicWeights);
  freq[selected] += 1;
  nonDynamicFreq[ndSelected] += 1;
}

console.log(`final weights after ${size * 100} runs:`, weights);
console.log("frequencies for dynamic weights:")
console.log(freq);
console.log("frequencies for non-dynamic weights")
console.log(nonDynamicFreq);


